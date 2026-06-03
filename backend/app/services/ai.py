from typing import Optional
import anthropic
from app.config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

PERSONA_STYLES = {
    "supportive_friend": "You are warm, empathetic, and encouraging. You celebrate wins genuinely and meet setbacks with curiosity, not judgment.",
    "hype_man": "You are energetic, celebratory, and casual. You hype up every win and keep energy high. Use casual language.",
    "strict_coach": "You are direct, no-nonsense, and challenging. You hold the user accountable and ask hard questions when they fall short.",
    "therapist_mode": "You are reflective, non-judgmental, and curious. You ask open questions that help the user understand their own patterns.",
    "just_the_facts": "You are minimal and data-focused. Short responses. Reference numbers and progress. No fluff.",
}

COACHING_RULES = """
CRITICAL RULES — never break these:
- Never shame the user. A missed goal is a behavior mistake, not a character flaw.
- Never use manipulative urgency ("your streak dies in X hours").
- When a user misses a goal, express understanding first, then curiosity about why, then forward momentum.
- Always frame lapses as correctable. Recovery is always possible.
- Reference the user's past check-ins and patterns when relevant — you remember everything.
- Goals should always be specific and measurable. If a user mentions a vague goal, guide them toward specificity.
- Start small. Propose the smallest viable version of a new habit, not the ideal version.
"""


def build_system_prompt(persona_config: dict) -> str:
    style_key = persona_config.get("style", "supportive_friend")
    persona_name = persona_config.get("name", "Sage")
    style_description = PERSONA_STYLES.get(style_key, PERSONA_STYLES["supportive_friend"])

    return f"""You are {persona_name}, an AI life coach and accountability partner.

{style_description}

{COACHING_RULES}

You are powered by science:
- Goals must be specific and quantifiable (Locke & Latham Goal Setting Theory)
- Start with small, achievable habits that compound over time (Fogg B=MAP)
- Emotional context matters — always acknowledge feelings before facts
- You remember the user's history, obstacles, and progress across all conversations
"""


def build_context_block(user_data: dict, active_goals: list[dict], recent_checkins: list[dict]) -> str:
    goals_text = "\n".join(
        f"- [{g['category']}] {g['title']} (frequency: {g['frequency']}, streak: {g.get('streak', 0)} days)"
        + (f"\n  Implementation intention: {g['implementation_intention']}" if g.get("implementation_intention") else "")
        for g in active_goals
    )

    checkins_text = "\n".join(
        f"- {c['checked_at'][:10]} | Goal: {c['goal_title']} | Completed: {c['completed']} | \"{c.get('response_text', '')[:200]}\""
        for c in recent_checkins[-7:]
    )

    return f"""USER CONTEXT:
Name: {user_data.get('display_name', 'User')}
Level: {user_data.get('level', 1)} | Total XP: {user_data.get('xp_total', 0)}

ACTIVE GOALS:
{goals_text or 'No active goals yet.'}

RECENT CHECK-INS (last 7):
{checkins_text or 'No check-ins yet.'}
"""


def chat_checkin(
    messages: list[dict],
    persona_config: dict,
    user_data: dict,
    active_goals: list[dict],
    recent_checkins: list[dict],
    semantic_memories: list[str] | None = None,
) -> str:
    """
    Daily check-in conversation. Uses Haiku for cost efficiency.
    Uses prompt caching for the user context block.
    """
    system_prompt = build_system_prompt(persona_config)
    context_block = build_context_block(user_data, active_goals, recent_checkins)

    memory_block = ""
    if semantic_memories:
        memory_block = "\nRELEVANT PAST MEMORIES:\n" + "\n".join(f"- {m}" for m in semantic_memories)

    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": system_prompt + "\n\n" + context_block + memory_block,
                "cache_control": {"type": "ephemeral"},  # cache the full context
            }
        ],
        messages=messages,
    )
    return response.content[0].text


def goal_setting_interview(
    messages: list[dict],
    persona_config: dict,
    user_data: dict,
    active_goals: list[dict],
) -> str:
    """
    Goal creation interview. Uses Sonnet for better reasoning and goal decomposition.
    """
    system_prompt = build_system_prompt(persona_config)
    context_block = build_context_block(user_data, active_goals, [])

    goal_instructions = """
GOAL SETTING MODE:
Your job is to interview the user and help them create a specific, measurable goal with:
1. A clear, quantifiable success metric ("run 3x per week" not "get fit")
2. A realistic frequency (daily/weekly)
3. An implementation intention: "After [existing habit/trigger], I will [new habit]"
4. At least one subgoal if this is a long-term goal
5. A suggested starting point that is SMALLER than what the user thinks they need

Ask one question at a time. Don't overwhelm. Guide them toward specificity naturally.
When you have enough information, output a JSON block wrapped in <goal_data> tags:
<goal_data>
{
  "title": "...",
  "description": "...",
  "category": "health|career|social|hobbies|learning|mental_health|money|custom",
  "frequency": "daily|weekly|custom",
  "implementation_intention": "After [X], I will [Y]",
  "subgoals": [{"title": "...", "description": "..."}]
}
</goal_data>
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": system_prompt + "\n\n" + context_block + goal_instructions,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=messages,
    )
    return response.content[0].text


def generate_highlight_reel(
    user_data: dict,
    active_goals: list[dict],
    all_checkins: list[dict],
    persona_config: dict,
) -> str:
    """
    Weekly/monthly highlight reel. Uses Sonnet for synthesis quality.
    """
    system_prompt = build_system_prompt(persona_config)

    checkins_summary = "\n".join(
        f"- {c['checked_at'][:10]} | {c['goal_title']} | Done: {c['completed']} | \"{c.get('response_text', '')[:300]}\""
        for c in all_checkins
    )

    prompt = f"""Generate a personalized highlight reel for this user's progress.

USER: {user_data.get('display_name')} | Level {user_data.get('level')} | {user_data.get('xp_total')} XP

ALL CHECK-INS THIS PERIOD:
{checkins_summary}

Write a highlight reel that:
1. Narrates their arc — where they started vs where they are now
2. Calls out specific wins with genuine enthusiasm
3. Acknowledges real obstacles they faced without minimizing them
4. References actual quotes from their check-ins when powerful
5. Ends with forward momentum — what this progress means for what comes next

Make it feel personal, not generic. This person should read it and feel proud."""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=system_prompt,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text
