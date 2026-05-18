"""
Agent 2: Provider Discovery Agent
Finds matching service providers from Firestore based on extracted intent.

Input:  Intent dict (from intent_agent)
Output: JSON list of matched providers with match_score
"""
import json
import sys
import os
import re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from firebase_client import get_providers
from google.adk import Agent

DISCOVERY_INSTRUCTION = """
You are a provider discovery agent for KhidmatAI — a Pakistani home services platform.

You will receive:
1. A user's service intent (JSON)
2. A list of available service providers (JSON)

Your job: Filter and rank providers that MATCH the user's needs. Consider:
- service_type must match
- location should be in the same city/area if specified
- providers with better ratings rank higher
- providers with more reviews are more trustworthy

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "matched_providers": [
    {
      "provider_id": "<string>",
      "name": "<string>",
      "service_type": "<string>",
      "location": "<string>",
      "rating": <float>,
      "reviews_count": <int>,
      "base_price": <int>,
      "phone": "<string>",
      "availability": "<string>",
      "match_score": <float 0.0-1.0>,
      "match_reason": "<why this provider matches>"
    }
  ],
  "total_found": <int>,
  "search_summary": "<brief explanation of results>"
}

If no providers match, return matched_providers as an empty list.
"""

discovery_agent = Agent(
    name="discovery_agent",
    model=MODEL,
    instruction=DISCOVERY_INSTRUCTION,
)


def discover_providers(intent: dict) -> dict:
    """
    Find matching providers for the given service intent.

    Args:
        intent: Structured intent dict from intent_agent

    Returns:
        dict with matched_providers list and metadata
    """
    service_type_map = {
        "AC_REPAIR": "AC technician",
        "PLUMBING": "plumber",
        "ELECTRICAL": "electrician",
        "CLEANING": "home cleaner",
        "CARPENTRY": "carpenter",
    }
    service_type = service_type_map.get(intent.get("service_type"), intent.get("service_type"))
    area = intent.get("location")
    if area:
        known_areas = ["F-7", "F-8", "G-10", "G-13", "DHA", "Gulberg"]
        area = next((known for known in known_areas if known.lower() in str(area).lower()), area)

    # Fetch matching providers from Firestore using service_type and area.
    all_providers = get_providers(service_type=service_type, area=area)

    # Confirm matches locally using the provider field service_types (plural).
    candidates = [
        p for p in all_providers
        if not service_type or service_type in p.get("service_types", [])
    ]

    requested_time = intent.get("time_slot") or intent.get("preferred_time") or intent.get("raw_input") or ""
    matched_providers = [_with_slot_match(provider, requested_time) for provider in candidates]

    return {
        "matched_providers": matched_providers,
        "total_found": len(matched_providers),
        "requested_time": requested_time,
        "requested_hour": _requested_hour(requested_time),
        "search_summary": "Providers filtered by service_type and area only; slot availability annotated separately.",
    }


SLOT_HOURS = {
    "9AM": 9,
    "10AM": 10,
    "12PM": 12,
    "1PM": 13,
    "2PM": 14,
    "3PM": 15,
    "4PM": 16,
    "5PM": 17,
    "6PM": 18,
}


def _requested_hour(requested_time: str) -> int | None:
    text = str(requested_time or "").lower()
    if not text:
        return None

    slot_match = re.search(r"\b(9am|10am|12pm|1pm|2pm|3pm|4pm|5pm|6pm)\b", text)
    if slot_match:
        slot = slot_match.group(1).upper()
        return SLOT_HOURS.get(slot)

    baje_match = re.search(r"\b(\d{1,2})\s*baje\b", text)
    if baje_match:
        hour = int(baje_match.group(1))
        if hour in {9, 10} or any(term in text for term in ("subah", "morning", "suba", "subha")):
            return hour
        if hour == 12:
            return 12
        if 1 <= hour <= 6:
            return hour + 12

    phrase_hours = [
        (("sham", "shaam", "evening"), 17),
        (("subah", "suba", "subha", "morning"), 9),
        (("dopahar", "dopehar", "dopehr", "noon", "midday"), 13),
        (("raat", "raath", "night"), 18),
    ]
    for terms, hour in phrase_hours:
        if any(term in text for term in terms):
            return hour
    return None


def _with_slot_match(provider: dict, requested_time: str) -> dict:
    provider_result = dict(provider)
    slots = provider.get("availability_slots") or []
    requested_hour = _requested_hour(requested_time)

    if not slots:
        provider_result.update({
            "slot_match_status": "none",
            "nearest_slot": None,
            "slot_distance_hours": None,
        })
        return provider_result

    if requested_hour is None:
        provider_result.update({
            "slot_match_status": "nearest",
            "nearest_slot": slots[0],
            "slot_distance_hours": 0,
        })
        return provider_result

    slot_distances = [
        (slot, abs(SLOT_HOURS[slot] - requested_hour))
        for slot in slots
        if slot in SLOT_HOURS
    ]
    if not slot_distances:
        provider_result.update({
            "slot_match_status": "none",
            "nearest_slot": None,
            "slot_distance_hours": None,
        })
        return provider_result

    nearest_slot, distance = min(slot_distances, key=lambda item: item[1])
    provider_result.update({
        "slot_match_status": "exact" if distance == 0 else "nearest",
        "nearest_slot": nearest_slot,
        "slot_distance_hours": distance,
    })
    return provider_result


if __name__ == "__main__":
    test_intent = {
        "service_type": "AC_REPAIR",
        "location": "DHA Lahore",
        "urgency": "URGENT",
        "budget_range": {"min": 2000, "max": 5000},
        "description": "AC not cooling, urgent repair needed",
        "raw_input": "My AC is not cooling, need urgent help in DHA Lahore",
    }

    print("Intent:", json.dumps(test_intent, indent=2))
    result = discover_providers(test_intent)
    print("\nDiscovery Result:", json.dumps(result, indent=2, ensure_ascii=False))
