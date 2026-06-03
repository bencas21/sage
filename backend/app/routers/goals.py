import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.goal import Goal, GoalStatus, GoalFrequency, GoalCategory
from app.models.streak import Streak

router = APIRouter(prefix="/goals", tags=["goals"])


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "custom"
    frequency: str = "daily"
    implementation_intention: Optional[str] = None
    target_date: Optional[datetime] = None
    parent_goal_id: Optional[uuid.UUID] = None


class GoalResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    category: str
    status: str
    frequency: str
    implementation_intention: Optional[str]
    target_date: Optional[datetime]
    parent_goal_id: Optional[uuid.UUID]
    created_at: datetime

    class Config:
        from_attributes = True


# Phase 0: single hardcoded user — replace with auth in Phase 2
PHASE0_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


@router.post("/", response_model=GoalResponse)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_db)):
    goal = Goal(
        user_id=PHASE0_USER_ID,
        title=goal_in.title,
        description=goal_in.description,
        category=goal_in.category,
        frequency=goal_in.frequency,
        implementation_intention=goal_in.implementation_intention,
        target_date=goal_in.target_date,
        parent_goal_id=goal_in.parent_goal_id,
    )
    db.add(goal)
    db.flush()

    streak = Streak(goal_id=goal.id, user_id=PHASE0_USER_ID)
    db.add(streak)
    db.commit()
    db.refresh(goal)
    return goal


@router.get("/", response_model=list[GoalResponse])
def list_goals(status: Optional[str] = "active", db: Session = Depends(get_db)):
    q = db.query(Goal).filter(Goal.user_id == PHASE0_USER_ID)
    if status:
        q = q.filter(Goal.status == status)
    return q.order_by(Goal.created_at.desc()).all()


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: uuid.UUID, db: Session = Depends(get_db)):
    goal = db.get(Goal, goal_id)
    if not goal or goal.user_id != PHASE0_USER_ID:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.patch("/{goal_id}/status")
def update_goal_status(goal_id: uuid.UUID, status: str, db: Session = Depends(get_db)):
    goal = db.get(Goal, goal_id)
    if not goal or goal.user_id != PHASE0_USER_ID:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.status = status
    if status == "completed":
        goal.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {"status": status}
