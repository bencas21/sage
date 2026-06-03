from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.stats import get_dashboard_stats, get_completion_graph
from app.routers.goals import PHASE0_USER_ID

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    user = db.get(User, PHASE0_USER_ID)
    return get_dashboard_stats(db, PHASE0_USER_ID, user)


@router.get("/graph")
def completion_graph(days: int = 30, db: Session = Depends(get_db)):
    return get_completion_graph(db, PHASE0_USER_ID, days)
