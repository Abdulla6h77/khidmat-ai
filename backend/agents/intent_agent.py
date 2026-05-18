"""
Agent 1: Intent Extraction Agent
Parses user natural language requests into structured service booking intents.

Input:  Raw user message (string)
Output: JSON with service_type, location, urgency, budget_range, description, confidence_score
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from google.adk import Agent

INTENT_INSTRUCTION = """
You are an intent extraction agent for KhidmatAI — a Pakistani home services booking platform.

Your job: Parse the user's message and extract a structured service booking intent.
You must handle Urdu, Roman Urdu, English, misspelled input, and mixed-language input.

Always respond with ONLY valid JSON — no markdown, no extra text.

JSON schema:
{
  "service_type": "<one of: AC_REPAIR, PLUMBING, ELECTRICAL, CLEANING, CARPENTRY, OTHER>",
  "location": "<city or area in Pakistan, e.g. Lahore, Karachi F-8>",
  "urgency": "<one of: URGENT, NORMAL, FLEXIBLE>",
  "time_slot": "<raw requested time expression such as sham, raat, 3 baje, morning, or null>",
  "budget_range": {
    "min": <integer PKR or null>,
    "max": <integer PKR or null>
  },
  "description": "<brief summary of what the user needs>",
  "raw_input": "<the original user message>",
  "confidence_score": <float from 0.0 to 1.0>,
  "needs_clarification": <true when confidence_score is less than 0.7, otherwise false>,
  "clarification_question": "<Urdu/Roman Urdu and English question if needs_clarification is true, otherwise null>"
}

Rules:
- If location is not mentioned, set "location" to null
- If budget is not mentioned, set both min and max to null
- Default urgency to "NORMAL" if unclear
- For service_type, pick the closest match or "OTHER"
- description should be 1-2 sentences summarizing the need
- Extract time_slot from complete Urdu, Roman Urdu, English, or mixed sentences.
- Morning expressions: subah, صبح, morning, suba, subha, early, jaldi, pehle.
- Midday expressions: dopahar, دوپہر, noon, midday, dopehar, dopehr, lunch time.
- Afternoon expressions: baad dopahar, بعد دوپہر, afternoon, dopahar baad, 3 baje, 4 baje.
- Evening expressions: sham, شام, evening, shaam, sunset, shab, late afternoon.
- Night expressions: raat, رات, night, raath, late, der se.
- Urgent/asap expressions: abhi, ابھی, now, asap, فوری, jaldi, urgent, turant.
- Specific time mentions: 10 baje, 3 baje, subah 10, or any number + baje.
- "kal" or "tomorrow" means next day timing context.
- Example: "Mujhe aaj sham ko plumber chahiye F-7 mein" should set time_slot to "sham".
- Example: "Kal raat electrician chahiye DHA mein" should set time_slot to "raat".
- Example: "Abhi AC technician bhejo G-13" should set time_slot to "abhi" and urgency to "URGENT".
- Example: "Dopahar ko carpenter chahiye" should set time_slot to "dopahar".
- confidence_score must always be between 0.0 and 1.0
- If confidence_score is below 0.7, needs_clarification must be true
- clarification_question must include both Urdu/Roman Urdu and English when clarification is needed
"""

intent_agent = Agent(
    name="intent_agent",
    model=MODEL,
    instruction=INTENT_INSTRUCTION,
)


def extract_intent(user_message: str) -> dict:
    """
    Extract structured intent from a user's service request message.

    Args:
        user_message: Raw natural language request from the user

    Returns:
        dict with keys: service_type, location, urgency, budget_range, description, raw_input
    """
    response_text = run_agent_sync(intent_agent, user_message)
    # Strip any accidental markdown
    cleaned = response_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    try:
        intent = json.loads(cleaned)
    except json.JSONDecodeError:
        intent = {
            "service_type": "OTHER",
            "location": None,
            "urgency": "NORMAL",
            "budget_range": {"min": None, "max": None},
            "description": user_message,
            "raw_input": user_message,
            "confidence_score": 0.0,
            "needs_clarification": True,
            "clarification_question": "Barah-e-karam service aur location wazeh kar dein. Please clarify the service and location.",
            "parse_error": response_text,
        }
    confidence = float(intent.get("confidence_score", 0.8))
    confidence = max(0.0, min(1.0, confidence))
    intent["confidence_score"] = confidence
    intent["needs_clarification"] = confidence < 0.7
    if intent["needs_clarification"] and not intent.get("clarification_question"):
        intent["clarification_question"] = (
            "Barah-e-karam service, area, aur waqt wazeh kar dein. "
            "Please clarify the service, area, and preferred time."
        )
    elif not intent["needs_clarification"]:
        intent["clarification_question"] = None
    return intent


if __name__ == "__main__":
    test_inputs = [
        "My AC is not cooling properly, need someone urgently in DHA Lahore. Budget around 2000-5000 rupees.",
        "Bijli ka masla hai ghar mein, Karachi F-8 area mein electrician chahiye.",
        "Need a plumber to fix a leaking pipe in my bathroom in Islamabad.",
    ]

    for msg in test_inputs:
        print(f"\nInput: {msg}")
        result = extract_intent(msg)
        print(f"Output: {json.dumps(result, indent=2, ensure_ascii=False)}")
