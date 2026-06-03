import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.database import Base


class GoalStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"
    archived = "archived"


class GoalFrequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    custom = "custom"


class GoalCategory(str, enum.Enum):
    health = "health"
    career = "career"
    social = "social"
    hobbies = "hobbies"
    learning = "learning"
    mental_health = "mental_health"
    money = "money"
    custom = "custom"


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    # self-referential: subgoals point to their parent
    parent_goal_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("goals.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), default=GoalCategory.custom)
    status: Mapped[GoalStatus] = mapped_column(SAEnum(GoalStatus), default=GoalStatus.active)
    frequency: Mapped[GoalFrequency] = mapped_column(SAEnum(GoalFrequency), default=GoalFrequency.daily)
    # "After [trigger], I will [action]" — Gollwitzer implementation intention
    implementation_intention: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    target_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="goals")
    subgoals: Mapped[list["Goal"]] = relationship(
        "Goal", back_populates="parent", cascade="all, delete-orphan"
    )
    parent: Mapped[Optional["Goal"]] = relationship("Goal", back_populates="subgoals", remote_side="Goal.id")
    checkins: Mapped[list["Checkin"]] = relationship(back_populates="goal", cascade="all, delete-orphan")
    streak: Mapped[Optional["Streak"]] = relationship(back_populates="goal", uselist=False, cascade="all, delete-orphan")
