import uuid
from datetime import datetime, timezone, date
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Streak(Base):
    __tablename__ = "streaks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    goal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("goals.id"), unique=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)
    last_checkin_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    # Grace day: one missed day per 7-day window doesn't break the streak
    grace_day_used_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    goal: Mapped["Goal"] = relationship(back_populates="streak")
