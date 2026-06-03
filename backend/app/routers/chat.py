import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.goal import Goal, GoalStatus
from app.models.checkin import Checkin
from app.services.ai import chat_checkin, goal_setting_interview, generate_highlight_reel
from app.routers.goals import PHASE0_USER_ID

router = APIRouter(prefix="/chat", tags=["chat"])


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    mode: str = "checkin"  # "checkin" | "goal_setting" | "highlight_reel"
    goal_id: Optional[uuid.UUID] = None


class ChatResponse(BaseModel):
    reply: str
    goal_data: Optional[dict] = None  # populated when goal_setting extracts a goal


def _get_user_context(db: Session) -> tuple[dict, list[dict], list[dict]]:
    user = db.get(User, PHASE0_USER_ID)
    if not user:
        raise HTTPException(status_code=404, detail="User not found — run seed first")

    active_goals = (
        db.query(Goal)
        .filter(Goal.user_id == PHASE0_USER_ID, Goal.status == GoalStatus.active)
        .all()
    )

    recent_checkins = (
        db.query(Checkin, Goal.title.label("goal_title"))
        .join(Goal, Checkin.goal_id == Goal.id)
        .filter(Checkin.user_id == PHASE0_USER_ID)
        .order_by(Checkin.checked_at.desc())
        .limit(10)
        .all()
    )

    user_data = {
        "display_name": user.display_name,
        "level": user.level,
        "xp_total": user.xp_total,
    }

    goals_data = [
        {
            "id": str(g.id),
            "title": g.title,
            "category": g.category,
            "frequency": g.frequency,
            "implementation_intention": g.implementation_intention,
            "streak": g.streak.current_streak if g.streak else 0,
        }
        for g in active_goals
    ]

    checkins_data = [
        {
            "checked_at": str(row.Checkin.checked_at),
            "goal_title": row.goal_title,
            "completed": row.Checkin.completed,
            "response_text": row.Checkin.response_text,
        }
        for row in recent_checkins
    ]

    return user_data, goals_data, checkins_data, user.persona_config


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    user_data, goals_data, checkins_data, persona_config = _get_user_context(db)
    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    if req.mode == "goal_setting":
        reply = goal_setting_interview(messages, persona_config, user_data, goals_data)
        goal_data = _extract_goal_data(reply)
        return ChatResponse(reply=reply, goal_data=goal_data)

    if req.mode == "highlight_reel":
        all_checkins = (
            db.query(Checkin, Goal.title.label("goal_title"))
            .join(Goal, Checkin.goal_id == Goal.id)
            .filter(Checkin.user_id == PHASE0_USER_ID)
            .order_by(Checkin.checked_at.asc())
            .all()
        )
        checkins_all = [
            {
                "checked_at": str(row.Checkin.checked_at),
                "goal_title": row.goal_title,
                "completed": row.Checkin.completed,
                "response_text": row.Checkin.response_text,
            }
            for row in all_checkins
        ]
        reply = generate_highlight_reel(user_data, goals_data, checkins_all, persona_config)
        return ChatResponse(reply=reply)

    # default: checkin
    reply = chat_checkin(messages, persona_config, user_data, goals_data, checkins_data)
    return ChatResponse(reply=reply)


def _extract_goal_data(text: str) -> Optional[dict]:
    import json, re
    match = re.search(r"<goal_data>(.*?)</goal_data>", text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(1).strip())
    except json.JSONDecodeError:
        return None
