"""
Agent 3: Ranking Agent
Ranks matched providers based on multiple weighted criteria.

Input:  discovery result dict (from discovery_agent)
Output: JSON with ranked providers list and ranking explanation
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from google.adk import Agent

RANKING_INSTRUCTION = """
You are a provider ranking agent for KhidmatAI — a Pakistani home services platform.

You will receive a list of matched service providers and the user's original intent.

Your job: Rank providers using exactly these weighted criteria:
1. distance_km 20%: lower is better
2. availability_match 20%: matches requested time slot
3. rating 15%: higher is better, scale 0-5
4. on_time_score 15%: higher is better, scale 0-1
5. cancellation_rate 10%: lower is better
6. specialization_level 10%: complex=1.0, intermediate=0.7, basic=0.4
7. price vs budget_sensitivity 10%: low budget prefers under 1200 PKR, medium under 2000 PKR, high accepts any price

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "ranked_providers": [
    {
      "rank": <int starting from 1>,
      "provider_id": "<string>",
      "name": "<string>",
      "service_type": "<string>",
      "location": "<string>",
      "rating": <float>,
      "reviews_count": <int>,
      "base_price": <int>,
      "phone": "<string>",
      "availability": "<string>",
      "total_score": <float 0.0-1.0>,
      "ranking_breakdown": {
        "distance_km": <float>,
        "availability_match": <float>,
        "rating": <float>,
        "on_time_score": <float>,
        "cancellation_rate": <float>,
        "specialization_level": <float>,
        "price_vs_budget_sensitivity": <float>
      },
      "ranking_reasoning": "<plain English explanation>"
    }
  ],
  "top_recommendation": "<provider_id of the best match>",
  "ranking_summary": "<brief explanation of ranking logic applied>"
}
"""

ranking_agent = Agent(
    name="ranking_agent",
    model=MODEL,
    instruction=RANKING_INSTRUCTION,
)


def _price_score(provider: dict, intent: dict) -> float:
    budget = intent.get("budget_range") or {}
    max_budget = budget.get("max")
    base_rate = provider.get("base_rate_per_hour") or provider.get("base_price") or 0
    if max_budget is None:
        sensitivity = "medium"
    elif max_budget <= 1200:
        sensitivity = "low"
    elif max_budget <= 2000:
        sensitivity = "medium"
    else:
        sensitivity = "high"
    if sensitivity == "high":
        return 1.0
    limit = 1200 if sensitivity == "low" else 2000
    return 1.0 if base_rate <= limit else max(0.0, 1.0 - ((base_rate - limit) / limit))


def _availability_score(provider: dict, intent: dict) -> float:
    status = provider.get("slot_match_status")
    distance = provider.get("slot_distance_hours")
    if status == "exact":
        return 1.0
    if status == "none":
        return 0.0
    if status == "nearest":
        if distance is None:
            return 0.0
        if distance <= 1:
            return 0.8
        if distance <= 2:
            return 0.6
        if distance <= 3:
            return 0.4
        return 0.2

    slots = provider.get("availability_slots") or []
    return 1.0 if slots else 0.0


def _specialization_score(provider: dict) -> float:
    level = str(provider.get("specialization_level", "basic")).lower()
    return {"complex": 1.0, "expert": 1.0, "intermediate": 0.7, "basic": 0.4, "beginner": 0.4}.get(level, 0.4)


def _rank_provider(provider: dict, intent: dict) -> dict:
    distance = float(provider.get("distance_km") or 0)
    factor_scores = {
        "distance_km": max(0.0, min(1.0, 1.0 - (distance / 20.0))),
        "availability_match": _availability_score(provider, intent),
        "rating": max(0.0, min(1.0, float(provider.get("rating") or 0) / 5.0)),
        "on_time_score": max(0.0, min(1.0, float(provider.get("on_time_score") or 0))),
        "cancellation_rate": max(0.0, min(1.0, 1.0 - float(provider.get("cancellation_rate") or 0))),
        "specialization_level": _specialization_score(provider),
        "price_vs_budget_sensitivity": _price_score(provider, intent),
    }
    weights = {
        "distance_km": 0.20,
        "availability_match": 0.20,
        "rating": 0.15,
        "on_time_score": 0.15,
        "cancellation_rate": 0.10,
        "specialization_level": 0.10,
        "price_vs_budget_sensitivity": 0.10,
    }
    total_score = sum(factor_scores[key] * weights[key] for key in weights)
    ranked = dict(provider)
    ranked["provider_id"] = ranked.get("provider_id") or ranked.get("id") or ranked.get("doc_id")
    ranked["base_price"] = ranked.get("base_price") or ranked.get("base_rate_per_hour")
    ranked["total_score"] = round(total_score, 4)
    ranked["ranking_breakdown"] = {key: round(value, 4) for key, value in factor_scores.items()}
    ranked["ranking_reasoning"] = (
        f"Ranked using distance, slot availability, rating, reliability, specialization, "
        f"and budget fit. Total score: {ranked['total_score']}."
    )
    return ranked


def rank_providers(discovery_result: dict, intent: dict) -> dict:
    """
    Rank the discovered providers based on multiple criteria.

    Args:
        discovery_result: Output from discovery_agent with matched_providers
        intent: Original user intent dict

    Returns:
        dict with ranked_providers list and top_recommendation
    """
    providers = discovery_result.get("matched_providers", [])

    if not providers:
        return {
            "ranked_providers": [],
            "top_recommendation": None,
            "ranking_summary": "No providers to rank.",
        }

    ranked = [_rank_provider(provider, intent) for provider in providers]
    ranked.sort(key=lambda item: item["total_score"], reverse=True)
    for index, provider in enumerate(ranked, start=1):
        provider["rank"] = index
    return {
        "ranked_providers": ranked,
        "top_recommendation": ranked[0].get("provider_id"),
        "ranking_summary": "Providers ranked with the required 7 weighted factors.",
    }


if __name__ == "__main__":
    test_discovery = {
        "matched_providers": [
            {"provider_id": "P001", "name": "Ahmed AC Services", "service_type": "AC_REPAIR",
             "location": "DHA Lahore", "rating": 4.8, "reviews_count": 120, "base_price": 1500,
             "phone": "+92-300-1234567", "availability": "available_today", "match_score": 0.95},
            {"provider_id": "P002", "name": "Cool Air Experts", "service_type": "AC_REPAIR",
             "location": "Gulberg Lahore", "rating": 4.5, "reviews_count": 85, "base_price": 2000,
             "phone": "+92-333-9876543", "availability": "available", "match_score": 0.80},
        ],
        "total_found": 2,
        "search_summary": "Found 2 AC repair providers in Lahore",
    }
    test_intent = {
        "service_type": "AC_REPAIR",
        "location": "DHA Lahore",
        "urgency": "URGENT",
        "budget_range": {"min": 2000, "max": 5000},
    }

    result = rank_providers(test_discovery, test_intent)
    print(json.dumps(result, indent=2, ensure_ascii=False))
