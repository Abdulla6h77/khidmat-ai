"""
Agent 4: Pricing Agent
Estimates fair price for the service based on provider base price, service complexity, and market rates.

Input:  ranked providers + intent
Output: JSON with price estimate, breakdown, and negotiation guidance
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from google.adk import Agent

PRICING_INSTRUCTION = """
You are a pricing estimation agent for KhidmatAI — a Pakistani home services platform.

You will receive the top-ranked provider details and the user's service intent.

Your job: Generate a fair, transparent price estimate for the service.

Consider these Pakistani market factors:
- AC Repair: base PKR 1,000-3,000, complex jobs PKR 3,000-8,000, gas refill adds PKR 2,000-4,000
- Plumbing: simple fix PKR 500-1,500, major repair PKR 2,000-6,000
- Electrical: wiring PKR 1,000-5,000, appliance fix PKR 800-3,000
- Cleaning: per room PKR 300-600, full house PKR 2,000-6,000
- Carpentry: small job PKR 1,000-3,000, custom work PKR 5,000-20,000
- URGENT jobs: add 20-30% premium
- Evening/night visits: add 15% premium

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "estimated_price": {
    "min": <int PKR>,
    "max": <int PKR>,
    "recommended": <int PKR>
  },
  "price_breakdown": {
    "base_service_fee": <int PKR>,
    "urgency_premium": <int PKR>,
    "parts_estimate": <int PKR>,
    "platform_fee": <int PKR>
  },
  "provider_base_price": <int PKR>,
  "budget_match": "<one of: WITHIN_BUDGET, SLIGHTLY_OVER, OVER_BUDGET, NO_BUDGET_PROVIDED>",
  "negotiation_tip": "<practical advice for the user on price negotiation>",
  "price_transparency": "<explanation of how price was calculated>"
}
"""

pricing_agent = Agent(
    name="pricing_agent",
    model=MODEL,
    instruction=PRICING_INSTRUCTION,
)


def estimate_price(ranked_result: dict, intent: dict) -> dict:
    """
    Estimate fair pricing for the service booking.

    Args:
        ranked_result: Output from ranking_agent with ranked_providers
        intent: Original user intent with budget_range

    Returns:
        dict with price estimate and breakdown
    """
    ranked = ranked_result.get("ranked_providers", [])
    top_provider = ranked[0] if ranked else {}
    base_rate = float(top_provider.get("base_rate_per_hour") or top_provider.get("base_price") or 0)
    distance_km = float(top_provider.get("distance_km") or 0)
    distance_surcharge = distance_km * 50

    urgency = str(intent.get("urgency", "next_day")).lower()
    urgency_key = intent.get("urgency_type") or ("same_day" if urgency in {"urgent", "same_day"} else "next_day")
    urgency_multiplier = {"same_day": 1.3, "next_day": 1.0, "scheduled": 0.9}.get(urgency_key, 1.0)

    complexity = str(intent.get("complexity", "basic")).lower()
    complexity_multiplier = {"basic": 1.0, "intermediate": 1.2, "complex": 1.5}.get(complexity, 1.0)

    subtotal = (base_rate + distance_surcharge) * urgency_multiplier * complexity_multiplier
    loyalty_discount = 0
    total_price = subtotal - loyalty_discount

    return {
        "base_rate": round(base_rate, 2),
        "distance_km": distance_km,
        "distance_surcharge": round(distance_surcharge, 2),
        "urgency_type": urgency_key,
        "urgency_multiplier": urgency_multiplier,
        "complexity": complexity,
        "complexity_multiplier": complexity_multiplier,
        "subtotal": round(subtotal, 2),
        "loyalty_discount": loyalty_discount,
        "total_price": round(total_price, 2),
        "estimated_price": {
            "min": round(total_price, 2),
            "max": round(total_price, 2),
            "recommended": round(total_price, 2),
        },
        "price_breakdown": {
            "base_rate": round(base_rate, 2),
            "distance_surcharge": round(distance_surcharge, 2),
            "urgency_multiplier": urgency_multiplier,
            "complexity_multiplier": complexity_multiplier,
            "subtotal": round(subtotal, 2),
            "loyalty_discount": loyalty_discount,
            "total_price": round(total_price, 2),
            "breakdown_explanation": (
                "Total price is calculated from provider base rate plus distance surcharge, "
                "then adjusted by urgency and complexity multipliers."
            ),
        },
        "breakdown_explanation": (
            "Formula: (base_rate + distance_km * 50) * urgency_multiplier * "
            "complexity_multiplier - loyalty_discount."
        ),
    }


if __name__ == "__main__":
    test_ranked = {
        "ranked_providers": [
            {"rank": 1, "provider_id": "P001", "name": "Ahmed AC Services",
             "service_type": "AC_REPAIR", "location": "DHA Lahore",
             "rating": 4.8, "reviews_count": 120, "base_price": 1500,
             "availability": "available_today", "overall_score": 9.2},
        ],
        "top_recommendation": "P001",
    }
    test_intent = {
        "service_type": "AC_REPAIR",
        "urgency": "URGENT",
        "budget_range": {"min": 2000, "max": 5000},
        "description": "AC not cooling, gas refill may be needed",
    }

    result = estimate_price(test_ranked, test_intent)
    print(json.dumps(result, indent=2, ensure_ascii=False))
