"""
Agent 6: Notification Agent
Sends notifications to both user and provider about booking status.

Input:  booking result dict
Output: JSON with notification records sent to Firestore
"""
import json
import sys
import os
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.runner_utils import MODEL, run_agent_sync
from firebase_client import create_notification
from google.adk import Agent

NOTIFICATION_INSTRUCTION = """
You are a notification agent for KhidmatAI — a Pakistani home services platform.

You will receive booking details and must generate notification messages for:
1. The USER (customer who booked)
2. The PROVIDER (service professional)

Tailor messages appropriately:
- User message: warm, assuring, includes provider details and ETA
- Provider message: professional, includes job details, location, and customer contact

Mix English and Urdu/Roman Urdu naturally (code-switching) as Pakistanis commonly communicate.

Respond with ONLY valid JSON — no markdown, no extra text.

Output schema:
{
  "user_notification": {
    "type": "BOOKING_CONFIRMED",
    "title": "<notification title>",
    "body": "<full notification body>",
    "sms_text": "<short SMS version, max 160 chars>",
    "channel": "push"
  },
  "provider_notification": {
    "type": "NEW_JOB_ASSIGNED",
    "title": "<notification title>",
    "body": "<full notification body>",
    "sms_text": "<short SMS version, max 160 chars>",
    "channel": "push"
  },
  "notifications_count": 2,
  "sent_at": "<ISO timestamp>"
}
"""

notification_agent = Agent(
    name="notification_agent",
    model=MODEL,
    instruction=NOTIFICATION_INSTRUCTION,
)


def send_notifications(booking_result: dict) -> dict:
    """
    Generate and store notifications for user and provider.

    Args:
        booking_result: Output from booking_agent

    Returns:
        dict with notification records and send status
    """
    booking_data = booking_result.get("booking_data", {})
    service = booking_result.get("service") or booking_data.get("service_type")
    provider = booking_result.get("provider_name") or booking_data.get("provider_name")
    time_slot = booking_result.get("time") or booking_data.get("time_slot")
    amount = booking_result.get("price") or booking_data.get("estimated_price")
    code = booking_result.get("confirmation_code") or booking_data.get("confirmation_code")

    notifications = [
        {
            "type": "english_confirmation",
            "message": (
                f"Your {service} booking is confirmed with {provider}. "
                f"Time: {time_slot}. Price: PKR {amount}. Confirmation: {code}"
            ),
        },
        {
            "type": "urdu_confirmation",
            "message": (
                f"Aap ki {service} booking confirm ho gayi hai. "
                f"Provider: {provider}. Waqt: {time_slot}. Qeemat: PKR {amount}."
            ),
        },
        {
            "type": "one_hour_reminder",
            "message": f"Reminder: Your {service} appointment is in 1 hour.",
        },
    ]

    sent_status = []
    for notif in notifications:
        notif_record = {
            "booking_id": booking_result.get("booking_id"),
            "recipient_type": "USER",
            "recipient_id": booking_data.get("user_id"),
            "type": notif.get("type"),
            "body": notif.get("message"),
            "channel": "push",
            "sent_at": datetime.now(timezone.utc).isoformat(),
            "status": "SENT",
        }
        try:
            notification_id = create_notification(notif_record)
            sent_status.append({"type": notif["type"], "status": "SAVED_TO_FIRESTORE", "notification_id": notification_id})
        except Exception as e:
            sent_status.append({"type": notif["type"], "status": "FAILED", "error": str(e)})

    return {
        "notifications": notifications,
        "notifications_count": 3,
        "send_status": sent_status,
        "booking_id": booking_result.get("booking_id"),
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
            "urgency": "URGENT",
            "estimated_price": 3500,
        },
        "confirmation": {
            "provider_contact": "+92-300-1234567",
            "estimated_arrival": "Within 2-3 hours",
        },
    }

    result = send_notifications(test_booking)
    print(json.dumps(result, indent=2, ensure_ascii=False))
