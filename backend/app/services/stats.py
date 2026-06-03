from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
import uuid

from app.models.checkin import Checkin
from app.models.goal import Goal, GoalStatus
from app.models.streak import Streak
from app.services.xp import xp_to_next_level, get_level_title


def get_dashboard_stats(db: Session, user_id: uuid.UUID, user) -> dict:
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    active_goals = (
        db.query(Goal)
        .filter(Goal.user_id == user_id, Goal.status == GoalStatus.active, Goal.parent_goal_id.is_(None))
        .all()
    )

    goal_ids = [g.id for g in active_goals]

    def completion_rate(since: datetime) -> float:
        if not goal_ids:
            return 0.0
        total = db.query(func.count(Checkin.id)).filter(
            Checkin.user_id == user_id,
            Checkin.checked_at >= since,
        ).scalar() or 0
        completed = db.query(func.count(Checkin.id)).filter(
            Checkin.user_id == user_id,
            Checkin.checked_at >= since,
            Checkin.completed == True,
        ).scalar() or 0
        return round(completed / total, 3) if total > 0 else 0.0

    streaks = db.query(Streak).filter(Streak.user_id == user_id).all()
    active_streaks = [
        {"goal_id": str(s.goal_id), "current": s.current_streak, "longest": s.longest_streak}
        for s in streaks
    ]
    total_streak = sum(s.current_streak for s in streaks)

    # Life Score: weighted composite (0-100)
    # Based on 30-day completion rate (60%) + streak momentum (40%)
    completion_30d = completion_rate(month_ago)
    max_possible_streak = max((s.current_streak for s in streaks), default=0)
    streak_score = min(max_possible_streak / 30, 1.0)
    life_score = round((completion_30d * 60) + (streak_score * 40))

    goals_data = []
    for goal in active_goals:
        streak = db.query(Streak).filter(Streak.goal_id == goal.id).first()
        recent = (
            db.query(Checkin)
            .filter(Checkin.goal_id == goal.id, Checkin.checked_at >= week_ago)
            .order_by(Checkin.checked_at.desc())
            .limit(7)
            .all()
        )
        goals_data.append({
            "id": str(goal.id),
            "title": goal.title,
            "category": goal.category,
            "frequency": goal.frequency,
            "streak": streak.current_streak if streak else 0,
            "longest_streak": streak.longest_streak if streak else 0,
            "recent_checkins": [
                {"date": c.checked_at.date().isoformat(), "completed": c.completed}
                for c in recent
            ],
        })

    return {
        "life_score": life_score,
        "level": xp_to_next_level(user.xp_total),
        "completion_7d": completion_rate(week_ago),
        "completion_30d": completion_30d,
        "active_goals": goals_data,
        "streaks": active_streaks,
        "total_streak_days": total_streak,
    }


def get_completion_graph(db: Session, user_id: uuid.UUID, days: int = 30) -> list[dict]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    checkins = (
        db.query(Checkin)
        .filter(Checkin.user_id == user_id, Checkin.checked_at >= since)
        .all()
    )

    by_date: dict[str, dict] = {}
    for c in checkins:
        date_str = c.checked_at.date().isoformat()
        if date_str not in by_date:
            by_date[date_str] = {"total": 0, "completed": 0}
        by_date[date_str]["total"] += 1
        if c.completed:
            by_date[date_str]["completed"] += 1

    return [
        {
            "date": date,
            "total": v["total"],
            "completed": v["completed"],
            "rate": round(v["completed"] / v["total"], 3) if v["total"] > 0 else 0.0,
        }
        for date, v in sorted(by_date.items())
    ]
