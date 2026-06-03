from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import goals, checkins, chat, stats

app = FastAPI(title="Sage API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in Phase 2
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(goals.router)
app.include_router(checkins.router)
app.include_router(chat.router)
app.include_router(stats.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "sage-api"}
