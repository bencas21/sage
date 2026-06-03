import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Text, Boolean, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector

from app.database import Base


class Checkin(Base):
    __tablename__ = "checkins"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    goal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("goals.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    # The user's response — rich qualitative text, not just yes/no
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    xp_awarded: Mapped[int] = mapped_column(Integer, default=0)
    # Optional 1-5 mood score the user can report
    mood_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    # pgvector embedding of response_text for semantic memory recall
    embedding: Mapped[Optional[list[float]]] = mapped_column(Vector(1536), nullable=True)

    goal: Mapped["Goal"] = relationship(back_populates="checkins")
    user: Mapped["User"] = relationship(back_populates="checkins")
