"""
KhidmatAI request pipeline.
Runs intent, discovery, ranking, and pricing, then waits for explicit booking
confirmation through /api/book.
"""
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from typing import Any

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.intent_agent import extract_intent
from agents.discovery_agent import discover_providers
from agents.ranking_agent import rank_providers
from agents.pricing_agent import estimate_price


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _summarize(value: Any) -> str:
    text = str(value)
    return text if len(text) <= 240 else text[:237] + "..."


def _field(request: Any, key: str, default: Any = None) -> Any:
    if isinstance(request, dict):
        return request.get(key, default)
    return getattr(request, key, default)


def _trace(trace_log: list[dict], agent_name: str, input_received: Any, decision_made: str, output_produced: Any, status: str) -> None:
    trace_log.append({
        "agent_name": agent_name,
        "input_received": _summarize(input_received),
        "decision_made": decision_made,
        "output_produced": _summarize(output_produced),
        "timestamp": _now(),
        "status": status,
    })


def run_pipeline(request: Any, user_id: str = "guest_user") -> dict:
    start = time.perf_counter()
    request_id = f"REQ{uuid.uuid4().hex[:12].upper()}"
    user_input = _field(request, "user_input") or _field(request, "message") or str(request)
    trace_log: list[dict] = []
    output: dict[str, Any] = {}

    try:
        intent = extract_intent(user_input)
        output["intent"] = intent
        _trace(trace_log, "intent_agent", user_input, "Extracted service intent", intent, "success")
    except Exception as exc:
        _trace(trace_log, "intent_agent", user_input, f"Intent extraction failed: {exc}", {}, "failed")
        return _final(request_id, user_input, output, trace_log, start)

    try:
        discovery = discover_providers(intent)
        output["discovery"] = discovery
        _trace(trace_log, "discovery_agent", intent, "Found matching providers", discovery, "success")
    except Exception as exc:
        discovery = {"matched_providers": [], "total_found": 0, "error": str(exc)}
        output["discovery"] = discovery
        _trace(trace_log, "discovery_agent", intent, f"Discovery failed: {exc}", discovery, "failed")

    if not discovery.get("matched_providers"):
        output["status"] = "NO_PROVIDERS_FOUND"
        return _final(request_id, user_input, output, trace_log, start)

    try:
        ranking = rank_providers(discovery, intent)
        output["ranking"] = ranking
        output["slot_suggestions"] = _slot_suggestions(
            ranking.get("ranked_providers", []),
            discovery.get("requested_time") or intent.get("time_slot") or intent.get("preferred_time"),
        )
        _trace(trace_log, "ranking_agent", discovery, "Ranked providers with 7 weighted factors", ranking, "success")
    except Exception as exc:
        ranking = {"ranked_providers": discovery.get("matched_providers", []), "error": str(exc)}
        output["ranking"] = ranking
        _trace(trace_log, "ranking_agent", discovery, f"Ranking failed: {exc}", ranking, "failed")

    try:
        pricing = estimate_price(ranking, intent)
        output["pricing"] = pricing
        _trace(trace_log, "pricing_agent", ranking, "Calculated formula-based pricing", pricing, "success")
    except Exception as exc:
        pricing = {"error": str(exc)}
        output["pricing"] = pricing
        _trace(trace_log, "pricing_agent", ranking, f"Pricing failed: {exc}", pricing, "failed")

    top_provider = (ranking.get("ranked_providers") or [{}])[0]
    provider_name = top_provider.get("name") or "the selected provider"
    total_price = pricing.get("total_price") or pricing.get("estimated_price", {}).get("recommended")
    output["awaiting_confirmation"] = True
    output["confirm_message"] = (
        f"Would you like to book {provider_name} for PKR {total_price}? "
        "Call /api/book to confirm."
    )

    return _final(request_id, user_input, output, trace_log, start)


def _slot_suggestions(providers: list[dict], requested_time: Any) -> list[dict]:
    suggestions = []
    requested = str(requested_time or "requested time")
    for provider in providers:
        status = provider.get("slot_match_status")
        nearest_slot = provider.get("nearest_slot")
        exact = status == "exact"
        if status == "none":
            note = f"{requested} not available. No provider slots are listed."
        elif exact:
            note = f"Exact match available at {nearest_slot}"
        else:
            note = f"{requested} not available. Nearest slot is {nearest_slot}"
        suggestions.append({
            "provider_name": provider.get("name"),
            "requested_time": requested,
            "exact_match": exact,
            "suggested_slot": nearest_slot,
            "slot_note": note,
        })
    return suggestions


def _final(request_id: str, user_input: str, pipeline_output: dict, trace_log: list[dict], start: float) -> dict:
    return {
        "request_id": request_id,
        "user_input": user_input,
        **pipeline_output,
        "trace_log": trace_log,
        "total_time_ms": round((time.perf_counter() - start) * 1000, 2),
    }


if __name__ == "__main__":
    demo = run_pipeline({
        "user_input": "My AC is not cooling. Need urgent help in F-7.",
        "user_id": "demo_user_001",
    })
    print(demo)
