"""
Run once after migrations to create the Phase 0 personal user.
Usage: python seed.py
"""
import uuid
from app.database import SessionLocal
from app.models.user import User

PHASE0_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def seed():
    db = SessionLocal()
    try:
        existing = db.get(User, PHASE0_USER_ID)
        if existing:
            print(f"User already exists: {existing.display_name}")
            return

        user = User(
            id=PHASE0_USER_ID,
            email="me@sage.local",
            display_name="Me",
            persona_config={"name": "Sage", "style": "supportive_friend"},
        )
        db.add(user)
        db.commit()
        print(f"Created personal user: {user.display_name} ({user.id})")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
