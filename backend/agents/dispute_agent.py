"""
Agent 8: Dispute Resolution Agent
Handles complaints and disputes between users and providers.

Input:  dispute details (booking_id, complaint, type)
Output: JSON with resolution plan and actions taken
"""
import json
import sys
import os
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from firebase_client import create_dispute
from google.adk import Agent

DISPUTE_INSTRUCTION = """
You are a dispute resolution agent for KhidmatAI — a Pakistani home services platform.

You will receive a customer complaint about a service booking.

Your job: Analyze the dispute and provide a fair, empathetic resolution plan.

Dispute categories and typical resolutions:
- POOR_QUALITY: Offer re-service or partial refund (25-50%)
- NO_SHOW: Full refund + apology + priority rebook
- OVERCHARGING: Review pricing, issue partial refund if overcharged
- RUDE_BEHAVIOR: Formal warning to provider, partial refund
- INCOMPLETE_WORK: Schedule completion visit or refund
- SAFETY_CONCERN: Immediate escalation, full refund, provider suspension review

Be empathetic and use a professional but warm Pakistani tone.

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "dispute_id": "<string>",
  "severity": "<one of: LOW, MEDIUM, HIGH, CRITICAL>",
  "category": "<dispute category string>",
  "resolution_plan": {
    "immediate_action": "<what happens right away>",
    "refund_offered": <int PKR or 0>,
    "refund_percentage": <int 0-100>,
    "re_service_offered": <bool>,
    "provider_action": "<action taken against provider>",
    "timeline": "<resolution timeline>"
  },
  "customer_message": "<empathetic message to customer explaining resolution>",
  "customer_message_urdu": "<same in Urdu/Roman Urdu>",
  "provider_warning": "<message/warning to provider>",
  "escalate_to_human": <bool>,
  "resolution_status": "IN_PROGRESS"
}
"""

dispute_agent = Agent(
    name="dispute_agent",
    model=MODEL,
    instruction=DISPUTE_INSTRUCTION,
)


def resolve_dispute(
    booking_id: str,
    complaint: str,
    dispute_type: str = "POOR_QUALITY",
    user_id: str = "anonymous",
    amount_paid: int = 0,
) -> dict:
    """
    Handle a user dispute/complaint about a booking.

    Args:
        booking_id: The booking reference
        complaint: User's complaint in their own words
        dispute_type: Category of dispute
        user_id: User submitting the complaint
        amount_paid: Amount the user paid

    Returns:
        dict with dispute_id, resolution plan, and messages
    """
    dispute_id = f"DSP{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    dispute_type = dispute_type.lower()
    resolutions = {
        "provider_no_show": {
            "resolution_action": "Rebook with different provider",
            "compensation_offer": "10% discount on next booking",
            "escalation_level": 2,
        },
        "price_disagreement": {
            "resolution_action": "Review pricing breakdown",
            "compensation_offer": "Refund difference if overcharged",
            "escalation_level": 1,
        },
        "quality_complaint": {
            "resolution_action": "Send supervisor for re-inspection",
            "compensation_offer": "50% refund or free redo",
            "escalation_level": 2,
        },
        "cancellation": {
            "resolution_action": "Full refund if 2hrs before",
            "compensation_offer": "Partial refund if late cancellation",
            "escalation_level": 1,
        },
    }
    resolution = resolutions.get(dispute_type, resolutions["quality_complaint"])
    result = {
        "dispute_id": dispute_id,
        "dispute_type": dispute_type if dispute_type in resolutions else "quality_complaint",
        "resolution_action": resolution["resolution_action"],
        "compensation_offer": resolution["compensation_offer"],
        "escalation_level": resolution["escalation_level"],
    }

    # Save dispute to Firestore
    dispute_record = {
        "dispute_id": dispute_id,
        "booking_id": booking_id,
        "user_id": user_id,
        "dispute_type": dispute_type,
        "complaint": complaint,
        "amount_paid": amount_paid,
        "resolution": result,
        "escalation_level": result["escalation_level"],
        "status": "IN_PROGRESS",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    firestore_saved = False
    try:
        create_dispute(dispute_record)
        firestore_saved = True
    except Exception as e:
        dispute_record["firestore_error"] = str(e)

    return {
        "dispute_id": dispute_id,
        **result,
        "firestore_saved": firestore_saved,
        "dispute_record": dispute_record,
    }


if __name__ == "__main__":
    result = resolve_dispute(
        booking_id="BK20260517ABCD",
        complaint="The AC technician came 3 hours late, was rude, and did not fix the issue properly. My AC is still not cooling.",
        dispute_type="POOR_QUALITY",
        user_id="user_001",
        amount_paid=3500,
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))
