"""
Agent 7: Service Follow-up Agent
Checks on service quality after completion and collects feedback.

Input:  completed booking dict
Output: JSON with follow-up message and rating request
"""
import json
import sys
import os
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from firebase_client import update_booking
from google.adk import Agent

FOLLOWUP_INSTRUCTION = """
You are a service quality follow-up agent for KhidmatAI — a Pakistani home services platform.

You will receive details about a completed service booking.

Your job: Generate a warm, culturally appropriate follow-up message to:
1. Ask if the service was completed satisfactorily
2. Request a star rating (1-5)
3. Ask for any feedback or issues
4. Offer to resolve any problems

Use a friendly Pakistani tone, mixing English and Urdu/Roman Urdu naturally.

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "followup_message": {
    "type": "SERVICE_FOLLOWUP",
    "title": "<message title>",
    "body": "<full follow-up message>",
    "sms_text": "<short SMS version, max 160 chars>",
    "rating_prompt": "<short text asking for 1-5 star rating>",
    "feedback_prompt": "<open-ended feedback question>"
  },
  "followup_scheduled": "<ISO timestamp or 'Immediately after completion'>",
  "reminder_scheduled": "<ISO timestamp for follow-up reminder if no response>",
  "quality_checklist": [
    "<question 1 to assess service quality>",
    "<question 2>",
    "<question 3>"
  ],
  "escalation_trigger": "<condition under which to escalate to dispute agent>"
}
"""

followup_agent = Agent(
    name="followup_agent",
    model=MODEL,
    instruction=FOLLOWUP_INSTRUCTION,
)


def send_followup(booking_result: dict, service_status: str = "COMPLETED") -> dict:
    """
    Send post-service follow-up to collect rating and feedback.

    Args:
        booking_result: Booking details dict
        service_status: Current status of the service (COMPLETED, IN_PROGRESS, etc.)

    Returns:
        dict with follow-up message and schedule
    """
    status_messages = {
        "en_route": "{provider} is on the way. ETA 15-20 minutes.",
        "arrived": "{provider} has arrived at your location.",
        "in_progress": "Service is currently in progress.",
        "completed": "Service completed. Please rate 1-5 stars.",
    }
    booking_data = booking_result.get("booking_data", {})
    booking_id = booking_result.get("booking_id", "UNKNOWN")
    normalized_status = service_status.lower()
    if normalized_status not in status_messages:
        normalized_status = "completed"
    provider = booking_result.get("provider_name") or booking_data.get("provider_name") or "Provider"
    message = status_messages[normalized_status].format(provider=provider)

    try:
        update_booking(booking_id, {
            "status": normalized_status,
        })
        status_updated = True
    except Exception as e:
        status_updated = False

    followup = {
        "status": normalized_status,
        "message": message,
        "all_status_messages": {
            "en_route": status_messages["en_route"].format(provider=provider),
            "arrived": status_messages["arrived"].format(provider=provider),
            "in_progress": status_messages["in_progress"],
            "completed": status_messages["completed"],
        },
        "feedback_request": "Service completed. Please rate 1-5 stars.",
    }

    return {
        "booking_id": booking_id,
        "followup": followup,
        "booking_status_updated": status_updated,
        "service_status": normalized_status,
    }


if __name__ == "__main__":
    test_booking = {
        "booking_id": "BK20260517ABCD",
        "booking_data": {
            "user_id": "user_001",
            "provider_id": "P001",
            "provider_name": "Ahmed AC Services",
            "service_type": "AC_REPAIR",
            "location": "DHA Lahore",
            "estimated_price": 3500,
        },
    }

    result = send_followup(test_booking, "COMPLETED")
    print(json.dumps(result, indent=2, ensure_ascii=False))
