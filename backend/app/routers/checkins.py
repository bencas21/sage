import uuid
from datetime import datetime, timezone, date, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.checkin import Checkin
from app.models.goal import Goal
from app.models.streak import Streak
from app.services.xp import award_xp
from app.routers.goals import PHASE0_USER_ID

router = APIRouter(prefix="/checkins", tags=["checkins"])


class CheckinCreate(BaseModel):
    goal_id: uuid.UUID
    completed: bool
    response_text: Optional[str] = None
    ai_response: Optional[str] = None
    mood_score: Optional[int] = None


class CheckinResponse(BaseModel):
    id: uuid.UUID
    goal_id: uuid.UUID
    completed: bool
    response_text: Optional[str]
    ai_response: Optional[str]
    xp_awarded: int
    checked_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=CheckinResponse)
def create_checkin(checkin_in: CheckinCreate, db: Session = Depends(get_db)):
    goal = db.get(Goal, checkin_in.goal_id)
    if not goal or goal.user_id != PHASE0_USER_ID:
        raise HTTPException(status_code=404, detail="Goal not found")

    checkin = Checkin(
        goal_id=checkin_in.goal_id,
        user_id=PHASE0_USER_ID,
        completed=checkin_in.completed,
        response_text=checkin_in.response_text,
        ai_response=checkin_in.ai_response,
        mood_score=checkin_in.mood_score,
    )
    db.add(checkin)
    db.flush()

    xp_total = 0
    if checkin_in.completed:
        xp_total += award_xp(db, PHASE0_USER_ID, "checkin_complete", checkin.id, "checkin")
        xp_total += award_xp(db, PHASE0_USER_ID, "goal_completed_today", checkin.id, "checkin")

    # Detailed reflection bonus (> 100 words)
    if checkin_in.response_text and len(checkin_in.response_text.split()) > 100:
        xp_total += award_xp(db, PHASE0_USER_ID, "detailed_reflection", checkin.id, "checkin")

    checkin.xp_awarded = xp_total
    _update_streak(db, checkin_in.goal_id, checkin_in.completed)
    db.commit()
    db.refresh(checkin)
    return checkin


def _update_streak(db: Session, goal_id: uuid.UUID, completed: bool):
    streak = db.query(Streak).filter(Streak.goal_id == goal_id).first()
    if not streak:
        return

    today = date.today()
    yesterday = today - timedelta(days=1)

    if not completed:
        # Check if grace day is available (not used in last 7 days)
        grace_available = (
            streak.grace_day_used_at is None
            or (today - streak.grace_day_used_at).days >= 7
        )
        if grace_available and streak.current_streak > 0:
            streak.grace_day_used_at = today  # use grace day, streak preserved
        else:
            streak.current_streak = 0
        return

    if streak.last_checkin_date == today:
        return  # already checked in today

    if streak.last_checkin_date in (yesterday, None):
        streak.current_streak += 1
    else:
        # gap of more than 1 day — reset (grace day already handled above)
        streak.current_streak = 1

    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.last_checkin_date = today


@router.get("/", response_model=list[CheckinResponse])
def list_checkins(goal_id: Optional[uuid.UUID] = None, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(Checkin).filter(Checkin.user_id == PHASE0_USER_ID)
    if goal_id:
        q = q.filter(Checkin.goal_id == goal_id)
    return q.order_by(Checkin.checked_at.desc()).limit(limit).all()
