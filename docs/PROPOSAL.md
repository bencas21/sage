# Sage — Product Proposal & Technical Plan

> **Working name:** Sage (to be finalized before public launch; conduct USPTO TESS search in Classes 009 & 042 before committing)
> **AI Persona name:** Sage
> **Version:** 1.0
> **Author:** bencas21
> **Status:** Pre-development

---

## Table of Contents

1. [Vision](#1-vision)
2. [Target User](#2-target-user)
3. [The Science Behind It](#3-the-science-behind-it)
4. [Core Features](#4-core-features)
5. [Feature → Science Mapping](#5-feature--science-mapping)
6. [The Sage AI Persona](#6-the-sage-ai-persona)
7. [Gamification Design](#7-gamification-design)
8. [Technical Architecture](#8-technical-architecture)
9. [Tech Stack](#9-tech-stack)
10. [Data Model](#10-data-model)
11. [Phased Roadmap](#11-phased-roadmap)
12. [Anti-Patterns — What We Will NOT Build](#12-anti-patterns--what-we-will-not-build)
13. [Risks](#13-risks)
14. [References](#14-references)

---

## 1. Vision

Sage is an AI-powered life coaching and goal tracking mobile app for people in their early twenties navigating the complexity of real adult life — career, health, relationships, money, and personal growth all at once.

Most goal apps are passive: you log, they chart. Sage is different. Sage is a coach that *talks to you* — it interviews you to set real, quantifiable goals, checks in with you regularly through rich conversational exchanges (not just checkboxes), remembers everything you've ever told it, and surfaces that memory to give you advice that actually fits your life.

The guiding philosophy is **compounding habits**: small, consistent actions that build on each other over time. Sage doesn't give you a 90-day transformation plan on day one. It starts small, earns your trust, and gradually layers on complexity as your habits solidify.

**Core differentiators:**
- Sage *remembers* you — every check-in, obstacle, emotion, and win is stored and recalled
- Goals are built from subgoals that compound into long-term change
- Rich qualitative check-ins (not just "did you do it?") capture emotional context and obstacles
- A real dashboard with stats, graphs, streaks, XP, and achievements — not just a chatbot
- The AI persona is fully customizable: bro, therapist, drill sergeant, supportive friend

---

## 2. Target User

**Primary:** People in their early-to-mid twenties entering the workforce for the first time. They have complex, multi-domain lives and want to feel good about making progress — but they're overwhelmed by where to start and lack accountability structures that used to come from school.

**Profile:**
- 21–28 years old
- Recently graduated or 1–3 years into a career
- Goals span multiple life areas simultaneously
- Tried journaling or goal apps before but didn't stick with them
- Responds to gamification (grew up with games/achievements)
- Wants to feel proud when looking back at their progress
- Prefers a conversational, personalized experience over rigid templates

---

## 3. The Science Behind It

Every major product decision in Sage is grounded in peer-reviewed behavioral science. This section is the foundation. These citations will also appear in an in-app "Why This Works" screen.

### 3.1 Goal Setting Theory (Locke & Latham)
Over 50 years of research confirm that **specific, challenging goals outperform vague "do your best" goals** across hundreds of studies. Goals drive behavior through four mechanisms: task strategy, task effort, task persistence, and task motivation.

*Sage application:* The onboarding interview and goal-setting AI never accepts vague goals. It always pushes toward specificity and measurability.

> Locke, E.A. & Latham, G.P. (1991). A theory of goal setting and task performance. *Academy of Management Review.* [Link](https://journals.aom.org/doi/10.5465/amr.1991.4278976)

### 3.2 Implementation Intentions (Gollwitzer, 1999)
"If-then" plans ("If situation X, then I will do Y") increase goal completion rates by **~3x** compared to goal intentions alone. A meta-analysis of 94 studies found a medium-to-large effect size (d = .65).

*Sage application:* During goal creation, Sage prompts the user to define an implementation intention: "After [trigger], I will [action]." These are stored and referenced in check-ins.

> Gollwitzer, P.M. (1999). Implementation intentions: Strong effects of simple plans. *American Psychologist, 54*(7), 493–503. [Link](https://www.prospectivepsych.org/sites/default/files/pictures/Gollwitzer_Implementation-intentions-1999.pdf)

### 3.3 Habit Formation — The 66-Day Reality (Lally et al., 2010)
The popular "21 days to form a habit" myth is false. UCL research tracking 96 participants found the average is **66 days**, with a range of **18 to 254 days** depending on the habit's complexity and the individual.

*Sage application:* Sage never promises a fixed timeline. It tracks automaticity via user self-report and shows a variable progress band rather than a fixed milestone. No guilt for hitting day 100 instead of day 66.

> Lally, P. et al. (2010). How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology.* [Link](https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit)

### 3.4 Fogg Behavior Model — B=MAP (Fogg, 2019)
Stanford researcher BJ Fogg's model: **Behavior = Motivation × Ability × Prompt**. The three variables interact multiplicatively. When ability is high, even low motivation triggers behavior. Core insight: **"You change best by feeling good, not feeling bad."**

*Sage application:* Sage minimizes friction (builds Ability), uses strategic prompts at optimal moments, and always responds with genuine positive reinforcement — never shame.

> Fogg, B.J. (2019). *Tiny Habits: The Small Changes That Change Everything.* Houghton Mifflin Harcourt. [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC12522219/)

### 3.5 Self-Efficacy Theory (Bandura, 1977)
Belief in one's capacity to execute behavior is one of the strongest predictors of outcomes. Self-efficacy is built through **mastery experiences** (small wins), vicarious learning, and verbal encouragement.

*Sage application:* Goals start small by design. Sage explicitly engineers early wins. The dashboard's XP and completion metrics are mastery feedback loops. Sage verbally celebrates progress in every check-in.

> Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. *Psychological Review.* [Link](https://www.apa.org/research-practice/conduct-research/self-efficacy-human-agency)

### 3.6 Self-Determination Theory — Autonomy, Competence, Relatedness (Ryan & Deci)
Intrinsic motivation — doing something because it's inherently satisfying — produces better outcomes and longer-lasting behavior change than extrinsic motivation (rewards/pressure). Three needs drive intrinsic motivation: **Autonomy** (choice), **Competence** (feeling capable), **Relatedness** (connection).

*Sage application:* Users choose their own goals (Autonomy). The XP/level system builds Competence. The AI persona acts as a Relatedness anchor. Goal framing is always toward intrinsic values (growth, health, purpose), not external rewards.

> Ryan, R.M. & Deci, E.L. (2000). Self-determination theory. [Link](https://selfdeterminationtheory.org/theory/)

### 3.7 Identity-Based Habits (Clear, 2018; Bem, 1972)
People who shift from outcome-based goals ("lose 20 lbs") to identity-based goals ("I'm becoming a healthy person") maintain habits far longer. Consistent behavior reinforces identity, which in turn makes the behavior easier to maintain.

*Sage application:* Sage language tracks identity shifts over time. Dashboard shows "X days as a [runner/reader/saver]" not just "X workouts logged." The AI references emerging identity in check-ins.

> Clear, J. (2018). *Atomic Habits.* Avery. [Link](https://jamesclear.com/atomic-habits-summary)

### 3.8 Progress Monitoring Meta-Analysis (Harkin et al., 2016)
A meta-analysis of **138 studies (19,951 participants)** found that increased monitoring frequency leads to greater goal attainment. **Behavioral monitoring** (tracking what you do) is more effective than outcome monitoring (tracking results). Effects are larger when progress is physically recorded.

*Sage application:* Daily check-ins are behavioral, not outcome-based. Sage asks "what did you do?" before "what number did you hit?" The physical act of logging in the app is itself an intervention.

> Harkin, B. et al. (2016). Does monitoring goal progress promote goal attainment? *Psychological Bulletin.* [Link](https://www.apa.org/pubs/journals/releases/bul-bul0000025.pdf)

### 3.9 Shame vs. Guilt in Goal Pursuit (Tangney et al., 2011; 2025)
**Shame** ("I am a failure") triggers withdrawal and goal abandonment. **Guilt** ("I made a mistake") triggers repair and reinvestment. Apps that trigger shame — through public failure, punitive streak breaks, or judgmental language — cause user dropout.

*Sage application:* This is a core design constraint. Streak breaks are never punished. Missed goals are framed as correctable behavior, not character flaws. Sage never shames.

> Tangney, J.P. et al. (2011). *Shame in the Therapy Hour.* APA. / Recent empirical review: [Link](https://www.mdpi.com/2076-328X/15/6/725)

### 3.10 Loss Aversion & Streak Psychology (Kahneman & Tversky, 1979)
The pain of losing is roughly **2x stronger** than the pleasure of gaining an equivalent reward. Streak mechanics work through loss aversion — users protect their streaks to avoid the pain of breaking them. Duolingo's 14% boost in day-14 retention is attributable to streak mechanics.

*Sage application:* Streaks exist but include a "grace day" recovery mechanic. Streaks are motivational tools, not punishment systems. Loss aversion is harnessed constructively, not exploitatively.

> Kahneman, D. & Tversky, A. (1979). Prospect theory. *Econometrica.* / Duolingo case: [Link](https://trophy.so/blog/duolingo-gamification-case-study)

### 3.11 AI Coaching Effectiveness (2024–2025)
Purpose-built AI coaching systems show **40–60% measurable behavior change** within 3–6 months. AI coaches are significantly more effective than control groups, delivering approximately 90% of the value of human coaches when properly implemented. Working alliance (rapport) is critical.

*Sage application:* Sage is designed to build rapport through memory, tone consistency, and genuine acknowledgment of emotional context in check-ins. It's not a chatbot — it's a coach.

> Systematic review: [Link](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9212136/) / Chatbot behavior change scoping review: [Link](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12895150/)

---

## 4. Core Features

### 4.1 Goal Categories
Default categories (AI can propose additional ones based on conversation):
- Health & Fitness
- Career & Professional Growth
- Social & Relationships
- Hobbies & Creativity
- Learning & Education
- Mental Health & Wellbeing
- Money & Financial Health

### 4.2 Goal Hierarchy
```
Long-Term Goal (e.g., "Run a half marathon by December")
  ├── Subgoal (e.g., "Run 3x per week consistently for 8 weeks")
  │     ├── Habit (e.g., "Run after work on Mon/Wed/Fri")
  │     └── Implementation Intention: "After I get home, I put on my shoes immediately"
  └── Subgoal (e.g., "Build to 8-mile long runs by week 10")
```

Goals are not one-size-fits-all. Sage proposes goals starting very small, then compounds complexity as habits solidify. Long-term goals are broken into subgoals; subgoals are broken into daily/weekly habits.

### 4.3 Conversational Check-ins
Check-ins are not binary (yes/no). They are short AI-led conversations. Example:

> **Sage:** "Hey — it's Monday. You said you'd run today. How did it go?"
> **User:** "I tried but I hurt my knee halfway through and had to stop. I feel really disappointed in myself."
> **Sage:** "That's genuinely frustrating, especially when you were showing up for it. Knee pain mid-run is real — let's make sure this doesn't derail you. How's the knee feeling now? And is this a one-time thing or has it been bothering you?"

This emotional context is stored in vector memory and influences future coaching.

### 4.4 Persistent AI Memory
Everything Sage learns is stored and recalled:
- Goals, subgoals, completion history
- Obstacles and patterns ("you often skip Mondays")
- Emotional context ("you mentioned feeling disappointed 3 times this month")
- Persona preferences (coaching style, tone, name)
- Identity shifts ("you've referred to yourself as a runner 4 times now")

### 4.5 Dashboard & Stats
Inspired by AutoSleep (clean data) and Duolingo (gamification):
- **Life Score** — composite score across all active categories (0–100)
- **Per-category rings/progress bars** — visual completion across goal areas
- **Streaks** — active streaks per habit with grace day indicator
- **XP & Level** — total experience points, current level, progress to next level
- **Completion %** — rolling 7-day and 30-day completion rates
- **Graphs** — completion trend over time per goal/category
- **Achievements/Badges** — unlocked milestones displayed on profile

### 4.6 Highlight Reel & Reflection
Periodically (weekly/monthly), Sage generates a personalized highlight reel:
- AI narrates your progress in a conversational tone ("Three weeks ago you told me you were struggling to even start. Look what you've built since then.")
- Stats comparison (this week vs. last week, this month vs. last month)
- Emotional arc surfaced from check-in history
- User can scroll through past check-ins as a journal

### 4.7 Persona Customization
During onboarding (and editable anytime):
- Give your Sage a name (default: "Sage")
- Choose coaching style: Supportive Friend / Hype Man (Bro) / Strict Coach / Therapist Mode / Just the Facts
- AI learns and adjusts tone over time based on what resonates

### 4.8 Notifications
- Phase 0: Local push notifications (Expo) for daily check-in reminders
- Phase 1+: In-app smart timing (Sage learns when you're most responsive)
- Phase 2+: SMS/iMessage via Twilio (optional, user preference)

---

## 5. Feature → Science Mapping

| Feature | Scientific Basis | Citation |
|---|---|---|
| AI pushes for specific, quantifiable goals | Goal Setting Theory: specific goals outperform vague ones | Locke & Latham (1991) |
| Implementation intention prompts in goal setup | If-then plans 3x goal completion rate | Gollwitzer (1999) |
| Goals start small, compound over time | Fogg B=MAP: reduce friction to build Ability | Fogg (2019) |
| Habit timeline shown as a range, not fixed | Habit formation averages 66 days, range 18–254 | Lally et al. (2010) |
| Daily behavioral check-ins (not outcome-only) | Behavioral monitoring > outcome monitoring | Harkin et al. (2016) |
| Emotional context captured in check-ins | Journaling: 3-5 days produces measurable wellbeing gains | Smyth (1998) |
| Streak recovery "grace day" mechanic | Shame triggers dropout; guilt triggers reinvestment | Tangney et al. (2011) |
| XP, levels, mastery feedback | Self-efficacy built through mastery experiences | Bandura (1977) |
| Identity language ("X days as a runner") | Identity-based habits outlast outcome-based habits | Clear (2018) |
| Goal framing toward intrinsic values | Intrinsic > extrinsic motivation for persistence | Ryan & Deci (2000) |
| Streak loss aversion (grace days preserve it) | Loss aversion 2x stronger than equivalent gain | Kahneman & Tversky (1979) |
| AI remembers obstacles and emotional patterns | Working alliance critical for coaching effectiveness | AI Coaching Review (2024) |
| Variable achievements/badges | Variable rewards activate dopamine-driven engagement | Gamification research |
| Highlight reel / reflection feature | Metacognitive journaling produces greater behavior change | Smyth meta-analysis |

---

## 6. The Sage AI Persona

### 6.1 Identity
Sage is the user's personal coach, accountability partner, and life tracker. It is not a chatbot. It has memory, continuity, and genuine investment in the user's progress. It evolves alongside the user.

### 6.2 Persona Modes (user-selectable, AI-refined over time)

| Mode | Tone | Example |
|---|---|---|
| Supportive Friend | Warm, empathetic, encouraging | "That took real courage. How are you feeling about it?" |
| Hype Man (Bro) | Energetic, celebratory, casual | "LETS GO! That's back-to-back weeks. You're built different." |
| Strict Coach | Direct, no-nonsense, challenging | "You missed two sessions. What's the real reason, and what changes this week?" |
| Therapist Mode | Reflective, non-judgmental, curious | "What do you think was underneath that resistance?" |
| Just the Facts | Minimal, data-focused | "2/3 goals completed this week. Completion: 67%. On track." |

### 6.3 Memory-Informed Coaching
Sage references memory in every interaction:
- "Last week you mentioned work stress was the trigger — is that still true?"
- "You've completed this goal 11 out of the last 14 days. That's a real streak."
- "Three months ago you told me you couldn't imagine running a mile. You just logged 4."

### 6.4 AI Model Strategy (Cost Optimization)

| Use Case | Model | Reason |
|---|---|---|
| Daily check-in conversation | Claude Haiku 4.5 | Fast, cheap, sufficient for conversational turns |
| Goal setting interview | Claude Sonnet 4.6 | Needs nuance and goal decomposition quality |
| Weekly synthesis / highlight reel | Claude Sonnet 4.6 | Complex reasoning over memory context |
| Persona preference detection | Claude Haiku 4.5 | Simple classification task |

**Prompt caching** is used for user context (persona, active goals, recent check-ins) to reduce token costs. Estimated personal use cost: $1–3/month.

---

## 7. Gamification Design

Inspired by Duolingo (streak psychology, XP, daily engagement) and AutoSleep (clean meaningful data visualization).

### 7.1 XP System
- Complete a check-in: +10 XP
- Complete a goal for the day: +25 XP
- Perfect week (all goals met): +100 XP bonus
- Honest reflection (detailed check-in with emotional content): +15 XP
- Streak milestone (7, 30, 100 days): +XP bonus

### 7.2 Levels

| Level | XP Required | Title |
|---|---|---|
| 1 | 0 | Beginner |
| 2 | 100 | Committed |
| 3 | 300 | Consistent |
| 4 | 600 | Disciplined |
| 5 | 1,000 | Focused |
| 10 | 5,000 | Architect |
| 20 | 20,000 | Sage |

### 7.3 Streaks
- Per-habit streaks displayed on dashboard
- Grace day: one missed day per 7-day window does not break the streak
- Streak recovery: if a streak breaks, Sage offers a "comeback challenge" to rebuild

### 7.4 Badges & Achievements
Examples:
- "First Step" — complete your first check-in
- "7-Day Warrior" — 7-day streak on any habit
- "Mind & Body" — active goals in both Health and Mental Health simultaneously
- "Deep Dive" — submit a check-in with 100+ words of reflection
- "Long Game" — maintain any goal for 66+ days
- "Built Different" — reach Level 10
- "The Full Life" — active goals in 5+ categories simultaneously

### 7.5 Life Score
A single composite number (0–100) reflecting overall goal engagement across all active categories. Weighted by recency and consistency. Displayed prominently on the dashboard. Inspired by AutoSleep's sleep score.

---

## 8. Technical Architecture

### 8.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mobile App (Expo/RN)                     │
│  Dashboard │ Check-in Chat │ Goals │ Reflection │ Profile        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS (REST + WebSocket)
┌──────────────────────────▼──────────────────────────────────────┐
│                     Python FastAPI Backend                       │
│  /goals  │ /checkins  │ /chat  │ /stats  │ /reflection          │
└──────┬───────────────────────────────────────────┬──────────────┘
       │                                           │
┌──────▼──────────┐                    ┌──────────▼──────────────┐
│   PostgreSQL    │                    │   Claude API            │
│  (Supabase)     │                    │   (Anthropic)           │
│                 │                    │   Haiku 4.5 / Sonnet 4.6│
│  - users        │                    └─────────────────────────┘
│  - goals        │
│  - subgoals     │
│  - checkins     │
│  - xp_events    │
│  - achievements │
│                 │
│  + pgvector     │
│  - embeddings   │
│    (checkins,   │
│     reflections)│
└─────────────────┘
```

### 8.2 Key Architectural Decisions

**Single database: PostgreSQL + pgvector**
Do NOT use a separate vector database (Pinecone, Weaviate). Use Supabase (managed Postgres with pgvector extension). Reasons:
- One service, one migration story, one backup
- Structured data (goals, completions, XP) joins cleanly with vector data (check-in embeddings)
- Zero additional cost at personal scale
- Supabase provides auth, real-time, and storage out of the box

**Two-layer memory:**
- **Relational layer:** goals, subgoals, completions, streaks, XP, badges (structured, queryable)
- **Vector layer:** check-in text, reflections, emotional context (semantic search for AI context injection)

**Never reset user data.** Every schema change is a migration. Production data (even personal) is preserved through all development iterations. Use Alembic for migrations from day one.

**Backend: Python FastAPI**
Aligns with the developer's primary language. Async-first for streaming AI responses. Hosted on AWS (ECS Fargate or Lambda) per developer's existing cloud expertise.

**Mobile: Expo Managed Workflow**
Leverages existing JS/web skills. Managed workflow handles certificates, builds, and OTA updates. Avoids bare React Native complexity until genuinely needed.

### 8.3 AI Context Window Strategy

On every AI call, inject:
1. **System prompt:** persona config, coaching philosophy, anti-shame rules
2. **Cached context:** user profile, active goals, implementation intentions (prompt cached)
3. **Recent check-ins:** last 5–7 check-ins (structured)
4. **Semantic memory:** top-K relevant past check-ins retrieved via pgvector similarity search on current conversation topic
5. **Current conversation:** the ongoing check-in

This gives Sage genuine memory without sending the entire history on every call.

---

## 9. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native + Expo (managed) | Web skills transfer; iOS-first; OTA updates |
| Language (mobile) | TypeScript | Type safety, strong ecosystem |
| UI components | NativeWind + custom | Tailwind familiarity; native performance |
| Backend | Python 3.12 + FastAPI | Developer's primary language; async; fast |
| Database | PostgreSQL via Supabase | Managed; pgvector built-in; free tier available |
| Vector search | pgvector (Supabase extension) | No separate service; joins with relational data |
| ORM / Migrations | SQLAlchemy + Alembic | Industry standard Python; migration history from day one |
| AI | Anthropic Claude API | Haiku 4.5 for check-ins, Sonnet 4.6 for synthesis |
| Embeddings | text-embedding-3-small (OpenAI) or Voyage AI | Cost-effective; high quality for semantic recall |
| Auth | Supabase Auth | Built-in with DB; JWT; easy mobile SDK |
| Notifications | Expo Notifications (local) | No APNs setup complexity in Phase 0 |
| SMS (Phase 2+) | Twilio | Industry standard; pay-per-use |
| Cloud (backend) | AWS (ECS Fargate or Lambda) | Developer's existing expertise |
| CI/CD | GitHub Actions | Monorepo; free for public repos |
| State management | Zustand | Lightweight; simple mental model |
| Navigation | Expo Router | File-based routing; aligns with web mental model |

---

## 10. Data Model

### Core Tables (Relational — PostgreSQL)

```sql
-- users
id, email, display_name, created_at, persona_config (jsonb), xp_total, level, timezone

-- goals
id, user_id, title, description, category, status (active/paused/completed/archived),
parent_goal_id (self-ref for subgoals), target_date, implementation_intention,
frequency (daily/weekly/custom), created_at, completed_at

-- checkins
id, goal_id, user_id, checked_at, completed (bool), response_text, ai_response,
xp_awarded, mood_score (1-5, optional), embedding vector(1536)

-- xp_events
id, user_id, amount, reason, source_id (goal/checkin/achievement), created_at

-- achievements
id, user_id, badge_key, unlocked_at, metadata (jsonb)

-- streaks
id, goal_id, user_id, current_streak, longest_streak, last_checkin_date,
grace_day_used_at
```

### Vector Layer (pgvector)
- `checkins.embedding` — embed `response_text` for semantic recall
- Similarity search: "find past check-ins where user mentioned [obstacle]"

---

## 11. Phased Roadmap

### Phase 0 — Personal MVP (Build first, use daily yourself)

**Goal:** The smallest app you would actually use every day. No audience, no auth complexity, no external integrations. This phase is about getting real personal data flowing so future phases build on real history.

**Scope:**
- [ ] Monorepo setup: `/backend`, `/mobile`, `/docs`
- [ ] Supabase project + schema (goals, checkins, streaks, xp_events, achievements)
- [ ] pgvector extension enabled; Alembic migrations from day one
- [ ] FastAPI backend with endpoints: `POST /goals`, `GET /goals`, `POST /checkins`, `GET /stats`
- [ ] Claude integration: Haiku 4.5 for check-in chat, Sonnet 4.6 for goal-setting interview
- [ ] Prompt caching for user context
- [ ] Basic Expo app: Tab navigation (Dashboard, Goals, Check-in, Profile)
- [ ] Dashboard: Life Score, active goal cards, streaks, XP bar
- [ ] Check-in screen: conversational chat UI with Sage
- [ ] Goal creation: AI-guided interview to set specific, quantifiable goals with subgoals
- [ ] Local push notification: daily check-in reminder
- [ ] Data never resets: Alembic migrations only, no DROP TABLE in production

**Out of scope for Phase 0:** SMS, onboarding flow, social features, voice, multi-user auth, monetization, App Store submission.

---

### Phase 1 — Polished Personal App

- [ ] Full gamification: XP events, level system, badges/achievements
- [ ] Graphs: completion trend over time per goal (7-day, 30-day, all-time)
- [ ] Highlight reel: weekly AI-generated reflection summary
- [ ] Streak recovery "comeback challenge"
- [ ] Persona customization UI (name, coaching style selector)
- [ ] Smooth onboarding flow (for eventual sharing with friends)
- [ ] Smart notification timing (learns when user is responsive)
- [ ] Goal pause/archive/complete flows
- [ ] Category-level stats and ring visualization (AutoSleep-inspired)

---

### Phase 2 — Share with Friends / Beta

- [ ] Multi-user auth (Supabase Auth, full JWT flow)
- [ ] SMS/iMessage check-ins via Twilio (opt-in)
- [ ] TestFlight distribution
- [ ] Feedback mechanism (in-app)
- [ ] Privacy controls (all data private by default)
- [ ] Optional: accountability partnerships (shared streaks with a friend)
- [ ] "Why This Works" in-app science screen with citations

---

### Phase 3 — Public Launch Prep

- [ ] App Store submission (Apple Developer account required)
- [ ] Final name trademark clearance (USPTO TESS, Classes 009 & 042)
- [ ] Subscription model implementation (RevenueCat)
- [ ] Rate limiting, abuse prevention
- [ ] GDPR/CCPA data export and deletion flows
- [ ] Production infrastructure hardening (AWS, monitoring, alerting)
- [ ] Cost modeling at scale (LLM costs are the dominant variable)

---

## 12. Anti-Patterns — What We Will NOT Build

Based on the behavioral science research, the following patterns are explicitly prohibited in Sage's design. These are not feature gaps — they are conscious design principles.

| Anti-Pattern | Why We Avoid It | Science Basis |
|---|---|---|
| Public shame for missed goals or broken streaks | Shame triggers goal abandonment, not reinvestment | Tangney et al. (2011) |
| Punitive streak mechanics with no recovery | Guilt spirals from streak loss cause app abandonment | Loss aversion research |
| Manipulative urgency ("Your streak dies in 2 hours!") | Dark pattern; creates anxiety, not motivation | Dark patterns research (2024) |
| Forced social sharing of failures | Social exposure of failure activates shame, not accountability | Gollwitzer social reality effect |
| Overly ambitious starter goals | Users set goals beyond their ability → failure → dropout | Fogg B=MAP; goal difficulty research |
| Vague goal acceptance ("get fit", "be better") | Vague goals are no more effective than "do your best" | Locke & Latham (1991) |
| Gamification as the primary value | Gamification enhances core value; it cannot replace it | Gamification meta-analysis (2024) |
| Interrupting users at wrong moments | Prompts only work at high motivation + high ability | Fogg B=MAP |

---

## 13. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Check-in fatigue (daily messages feel like chores) | High | High | Allow frequency customization; Sage learns optimal cadence; skip forgiveness |
| LLM cost at scale | Medium | High | Haiku for 80% of calls; prompt caching; rate limits; subscription offsets cost |
| Scope creep expanding Phase 0 | High | Medium | Phase 0 scope is locked; ideas go in a backlog, not the current build |
| Trademark conflict on "Sage" | Medium | Medium | Working name only; formal USPTO search before any public launch |
| Retention collapse at week 3 | High | High | Science-backed design minimizes it, but expect it; plan re-engagement flows early |
| Privacy concerns (deeply personal data) | Medium | High | All data private by default; user owns their data; export/delete in Phase 3 |
| iOS development learning curve | Medium | Low | Expo managed workflow minimizes native complexity; large community |
| AI response quality inconsistency | Low | Medium | System prompt + persona config + few-shot examples keep tone consistent |

---

## 14. References

1. Locke, E.A. & Latham, G.P. (1991). A theory of goal setting and task performance. *Academy of Management Review.* https://journals.aom.org/doi/10.5465/amr.1991.4278976

2. Gollwitzer, P.M. (1999). Implementation intentions: Strong effects of simple plans. *American Psychologist, 54*(7), 493–503. https://www.prospectivepsych.org/sites/default/files/pictures/Gollwitzer_Implementation-intentions-1999.pdf

3. Gollwitzer, P.M. & Brandstätter, V. (1997). Implementation intentions and effective goal pursuit. *Journal of Personality and Social Psychology, 73*(1), 186–199. https://sparq.stanford.edu/sites/g/files/sbiybj19021/files/media/file/gollwitzer_brandstatter_1997_-_implementation_intentions_effective_goal_pursuit.pdf

4. Lally, P. et al. (2010). How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology.* https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit

5. Fogg, B.J. (2019). *Tiny Habits: The Small Changes That Change Everything.* Houghton Mifflin Harcourt. https://pmc.ncbi.nlm.nih.gov/articles/PMC12522219/

6. Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. *Psychological Review.* https://www.apa.org/research-practice/conduct-research/self-efficacy-human-agency

7. Ryan, R.M. & Deci, E.L. (2000). Self-determination theory and the facilitation of intrinsic motivation. *American Psychologist, 55*(1), 68–78. https://selfdeterminationtheory.org/theory/

8. Clear, J. (2018). *Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones.* Avery. https://jamesclear.com/atomic-habits-summary

9. Harkin, B. et al. (2016). Does monitoring goal progress promote goal attainment? Meta-analysis of 138 studies. *Psychological Bulletin.* https://www.apa.org/pubs/journals/releases/bul-bul0000025.pdf

10. Smyth, J.M. (1998). Written emotional expression: Effect sizes, outcome types, and moderating variables. *Journal of Consulting and Clinical Psychology.* https://www.reflection.app/blog/empower-your-coaching-and-therapy-clients-through-reflective-journaling

11. Tangney, J.P. et al. (2011). *Shame in the Therapy Hour.* APA. / Empirical review (2025): https://www.mdpi.com/2076-328X/15/6/725

12. Kahneman, D. & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. *Econometrica, 47*(2), 263–291.

13. Duolingo gamification case study: https://trophy.so/blog/duolingo-gamification-case-study

14. AI coaching effectiveness systematic review (2024): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9212136/

15. AI chatbots for health behavior change, scoping review (2024): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12895150/

16. Gamification meta-analysis, academic performance (2024): https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1111/bjet.13471

17. Dark patterns in mobile apps (2024): https://arxiv.org/pdf/2412.05039

18. Milkman, K. (2021). Fresh start effects and temporal landmarks. Wharton. https://knowledge.wharton.upenn.edu/podcast/ripple-effect/the-psychology-of-new-years-resolutions-katy-milkman/

19. Steel, P. (2007). Temporal Motivation Theory. *Psychological Bulletin.* https://goal-lab.psych.umn.edu/orgpsych/readings/12.%20Judgment%20&%20Decision%20Making/Steel%20&%20Konig%20(2006).pdf

---

*This document is the source of truth for Sage's product vision, feature scope, technical architecture, and scientific foundation. All implementation decisions should be traceable back to this document. Update it as the product evolves.*
