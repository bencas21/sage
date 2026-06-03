from sqlalchemy.orm import Session
from app.models.xp import XPEvent
from app.models.user import User
import uuid

XP_REWARDS = {
    "checkin_complete": 10,
    "goal_completed_today": 25,
    "perfect_week": 100,
    "detailed_reflection": 15,  # check-in response > 100 words
    "streak_7": 50,
    "streak_30": 200,
    "streak_100": 500,
}

LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000, 7000, 10000, 20000]
LEVEL_TITLES = [
    "Beginner", "Committed", "Consistent", "Disciplined", "Focused",
    "Driven", "Relentless", "Elite", "Master", "Architect",
    "Legend", "Transcendent", "Sage",
]


def award_xp(db: Session, user_id: uuid.UUID, reason_key: str, source_id: uuid.UUID | None = None, source_type: str | None = None) -> int:
    amount = XP_REWARDS.get(reason_key, 0)
    if amount == 0:
        return 0

    event = XPEvent(
        user_id=user_id,
        amount=amount,
        reason=reason_key,
        source_id=source_id,
        source_type=source_type,
    )
    db.add(event)

    user = db.get(User, user_id)
    user.xp_total += amount
    user.level = calculate_level(user.xp_total)
    db.commit()
    return amount


def calculate_level(xp: int) -> int:
    level = 1
    for i, threshold in enumerate(LEVEL_THRESHOLDS):
        if xp >= threshold:
            level = i + 1
    return min(level, len(LEVEL_TITLES))


def get_level_title(level: int) -> str:
    idx = min(level - 1, len(LEVEL_TITLES) - 1)
    return LEVEL_TITLES[idx]


def xp_to_next_level(xp: int) -> dict:
    current_level = calculate_level(xp)
    if current_level >= len(LEVEL_THRESHOLDS):
        return {"current": xp, "needed": 0, "progress": 1.0}

    current_threshold = LEVEL_THRESHOLDS[current_level - 1]
    next_threshold = LEVEL_THRESHOLDS[current_level] if current_level < len(LEVEL_THRESHOLDS) else xp
    progress = (xp - current_threshold) / max(next_threshold - current_threshold, 1)

    return {
        "current_xp": xp,
        "level": current_level,
        "title": get_level_title(current_level),
        "xp_to_next": max(next_threshold - xp, 0),
        "progress": round(min(progress, 1.0), 3),
    }
