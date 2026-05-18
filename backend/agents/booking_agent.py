"""
Agent 5: Booking Agent
Creates the confirmed booking in Firestore and returns booking confirmation.

Input:  top provider, pricing, intent, user_id
Output: JSON booking confirmation with booking_id
"""
import json
import sys
import os
import uuid
import random
import re
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from firebase_client import create_booking, db
from google.adk import Agent

BOOKING_INSTRUCTION = """
You are a booking confirmation agent for KhidmatAI — a Pakistani home services platform.

You will receive details of a service booking (provider, pricing, intent).

Your job: Generate a structured booking confirmation message and schedule details.

Consider:
- Urgency URGENT: schedule within 2-4 hours
- Urgency NORMAL: schedule within same day or next day
- Urgency FLEXIBLE: schedule within 2-3 days

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "confirmation_message": "<friendly confirmation message in English>",
  "urdu_message": "<same message in Urdu/Roman Urdu for Pakistani users>",
  "scheduled_time": "<ISO datetime string or descriptive like 'Within 2-4 hours'>",
  "estimated_arrival": "<human-readable ETA>",
  "provider_contact": "<phone number>",
  "booking_instructions": ["<step 1>", "<step 2>", "<step 3>"],
  "cancellation_policy": "<brief cancellation policy>",
  "status": "CONFIRMED"
}
"""

booking_agent = Agent(
    name="booking_agent",
    model=MODEL,
    instruction=BOOKING_INSTRUCTION,
)


def create_booking_record(
    intent: dict,
    top_provider: dict,
    pricing: dict,
    user_id: str = "guest_user",
    trace_log: list | None = None,
) -> dict:
    """
    Create a confirmed booking in Firestore.

    Args:
        intent: User service intent
        top_provider: Best ranked provider dict
        pricing: Price estimate dict
        user_id: User identifier

    Returns:
        dict with booking_id and confirmation details
    """
    user_id = user_id or "guest_user"
    provider_id = top_provider.get("provider_id") or top_provider.get("id") or top_provider.get("doc_id")
    availability_slots = [
        slot for slot in (top_provider.get("availability_slots") or ["9AM", "10AM", "11AM", "2PM", "4PM"])
        if slot != "next_available"
    ] or ["9AM", "10AM", "11AM", "2PM", "4PM"]
    time_slot, urgency = _resolve_time_slot(intent, availability_slots)

    conflicts = list(
        db.collection("bookings")
        .where("provider_id", "==", provider_id)
        .where("time_slot", "==", time_slot)
        .limit(1)
        .stream()
    )
    if conflicts:
        next_free_slots = []
        for slot in available_slots:
            if slot == time_slot:
                continue
            slot_conflicts = list(
                db.collection("bookings")
                .where("provider_id", "==", provider_id)
                .where("time_slot", "==", slot)
                .limit(1)
                .stream()
            )
            if not slot_conflicts:
                next_free_slots.append(slot)
            if len(next_free_slots) == 3:
                break
        return {
            "status": "conflict",
            "provider_id": provider_id,
            "provider_name": top_provider.get("name"),
            "requested_time": time_slot,
            "next_available_slots": next_free_slots,
            "message": "Requested slot is already booked. No booking was created.",
        }

    booking_id = f"BK{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4].upper()}"
    confirmation_code = f"{random.randint(0, 999999):06d}"
    price_breakdown = _standard_price_breakdown(pricing)
    price = (
        pricing.get("total_price")
        or pricing.get("estimated_price", {}).get("recommended")
        or price_breakdown.get("total_price")
    )

    booking_data = {
        "booking_id": booking_id,
        "user_id": user_id,
        "provider_id": provider_id,
        "provider_name": top_provider.get("name"),
        "service_type": intent.get("service_type"),
        "time_slot": time_slot,
        "location": intent.get("location"),
        "urgency": urgency,
        "price_breakdown": price_breakdown,
        "status": "confirmed",
        "confirmation_code": confirmation_code,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "trace_log": trace_log or [],
    }

    try:
        firestore_doc_id = create_booking(booking_data)
        firestore_saved = True
    except Exception as e:
        firestore_doc_id = None
        firestore_saved = False
        booking_data["firestore_error"] = str(e)

    return {
        "booking_id": booking_id,
        "provider_name": top_provider.get("name"),
        "service": intent.get("service_type"),
        "time": time_slot,
        "price": price,
        "status": "confirmed",
        "confirmation_code": confirmation_code,
        "firestore_saved": firestore_saved,
        "firestore_doc_id": firestore_doc_id,
        "booking_data": booking_data,
    }


def _resolve_time_slot(intent: dict, availability_slots: list[str]) -> tuple[str, str]:
    availability_slots = [slot for slot in availability_slots if slot != "next_available"] or ["9AM", "10AM", "11AM", "2PM", "4PM"]
    requested = str(intent.get("time_slot") or intent.get("preferred_time") or "").strip()
    requested_lower = requested.lower()
    raw_input = str(intent.get("raw_input") or intent.get("description") or "").lower()
    text = f"{requested_lower} {raw_input}"
    urgency = intent.get("urgency") or "normal"

    if "kal" in text or "tomorrow" in text:
        urgency = "next_day"

    specific_slot = _specific_baje_slot(text, availability_slots)
    if specific_slot:
        return specific_slot, urgency

    bucket_terms = [
        ({"abhi", "ابھی", "now", "asap", "فوری", "jaldi", "urgent", "turant"}, availability_slots, "urgent"),
        ({"subah", "صبح", "morning", "suba", "subha", "early", "jaldi", "pehle"}, ["9AM", "10AM"], None),
        ({"dopahar", "دوپہر", "noon", "midday", "dopehar", "dopehr", "lunch time"}, ["12PM", "1PM"], None),
        ({"baad dopahar", "بعد دوپہر", "afternoon", "dopahar baad", "3 baje", "4 baje"}, ["2PM", "3PM", "4PM"], None),
        ({"sham", "شام", "evening", "shaam", "sunset", "shab", "late afternoon"}, ["5PM", "6PM"], None),
        ({"raat", "رات", "night", "raath", "late", "der se"}, ["6PM"], None),
    ]

    for terms, preferred_slots, urgency_override in bucket_terms:
        if any(term in text for term in terms):
            if urgency_override:
                urgency = urgency_override
            slot = _first_available(preferred_slots, availability_slots)
            if slot:
                return slot, urgency

    if requested and requested in availability_slots:
        return requested, urgency

    return availability_slots[0], urgency


def _first_available(preferred_slots: list[str], availability_slots: list[str]) -> str | None:
    for slot in preferred_slots:
        if slot in availability_slots:
            return slot
    return availability_slots[0] if availability_slots else None


def _specific_baje_slot(text: str, availability_slots: list[str]) -> str | None:
    match = re.search(r"\b(\d{1,2})\s*(?:baje|بجے)\b", text)
    if not match and any(term in text for term in {"subah", "صبح", "morning", "suba", "subha"}):
        match = re.search(r"\b(\d{1,2})\b", text)
    if not match:
        return None
    hour = int(match.group(1))
    if hour == 0 or hour > 12:
        return None

    morning_terms = {"subah", "صبح", "morning", "suba", "subha"}
    evening_terms = {"sham", "شام", "evening", "shaam", "raat", "رات", "night"}
    if hour in {9, 10, 11} or any(term in text for term in morning_terms):
        candidate = f"{hour}AM"
    elif hour == 12:
        candidate = "12PM"
    elif any(term in text for term in evening_terms) and hour <= 6:
        candidate = f"{hour}PM"
    else:
        candidate = f"{hour}PM" if hour <= 6 else f"{hour}AM"

    return candidate if candidate in availability_slots else None


def _standard_price_breakdown(pricing: dict) -> dict:
    breakdown = pricing.get("price_breakdown") or pricing
    return {
        "base_rate": float(breakdown.get("base_rate", 0)),
        "distance_surcharge": float(breakdown.get("distance_surcharge", 0)),
        "urgency_multiplier": float(breakdown.get("urgency_multiplier", 1)),
        "complexity_multiplier": float(breakdown.get("complexity_multiplier", 1)),
        "subtotal": float(breakdown.get("subtotal", 0)),
        "loyalty_discount": float(breakdown.get("loyalty_discount", 0)),
        "total_price": float(breakdown.get("total_price", pricing.get("total_price", 0))),
        "breakdown_explanation": breakdown.get("breakdown_explanation", ""),
    }


if __name__ == "__main__":
    test_intent = {
        "service_type": "AC_REPAIR", "location": "DHA Lahore",
        "urgency": "URGENT", "description": "AC not cooling",
    }
    test_provider = {
        "provider_id": "P001", "name": "Ahmed AC Services",
        "phone": "+92-300-1234567", "base_price": 1500,
    }
    test_pricing = {
        "estimated_price": {"recommended": 3500},
        "price_breakdown": {"base_service_fee": 1500, "urgency_premium": 450, "parts_estimate": 1450, "platform_fee": 100},
    }

    result = create_booking_record(test_intent, test_provider, test_pricing, "user_test_001")
    print(json.dumps(result, indent=2, ensure_ascii=False))
