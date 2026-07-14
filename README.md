# Sage

AI-powered goal tracking and life-coaching app. Sage pairs a habit/goal-tracking core (streaks, check-ins, XP, achievements) with an LLM coaching persona that gives personalized feedback grounded in behavioral science.

## How it works

- Set goals and log check-ins; Sage tracks streaks, XP, and achievements to reinforce the habit loop.
- An AI coaching persona (Claude) reviews progress and chats with the user, grounded in the behavioral-science framework laid out in [`docs/PROPOSAL.md`](docs/PROPOSAL.md).

## Stack

- **Backend:** FastAPI, SQLAlchemy + Alembic, PostgreSQL/pgvector, Anthropic Claude
- **Mobile:** Expo (React Native), Expo Router, Zustand

## Status

Early build — see the [product proposal](docs/PROPOSAL.md) for the full vision, feature/science mapping, and phased roadmap.
