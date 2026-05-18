from typing import Any

from fastapi import FastAPI, HTTPException

from agents.booking_agent import create_booking_record
from agents.notification_agent import send_notifications
from agents.followup_agent import send_followup
from agents.dispute_agent import resolve_dispute
from firebase_client import get_booking_by_id, get_provider_by_id, get_providers
from pipeline import run_pipeline


app = FastAPI(title="KhidmatAI Backend")


@app.get("/")
def root() -> dict:
    return {
        "status": "ok",
        "message": "KhidmatAI Backend is running.",
        "health": "/api/health",
        "docs": "/docs",
    }


@app.post("/api/request")
def api_request(payload: dict[str, Any]) -> dict:
    user_input = payload.get("user_input") or payload.get("message")
    if not user_input:
        raise HTTPException(status_code=400, detail="user_input is required")
    return run_pipeline(payload, user_id=payload.get("user_id", "guest_user"))


@app.post("/api/book")
def api_book(payload: dict[str, Any]) -> dict:
    provider_id = payload.get("provider_id")
    if not provider_id:
        raise HTTPException(status_code=400, detail="provider_id is required")

    intent = dict(payload.get("intent") or {})
    if payload.get("service_type"):
        intent["service_type"] = payload["service_type"]
    if payload.get("time_slot"):
        intent["time_slot"] = payload["time_slot"]
    if payload.get("location"):
        intent["location"] = payload["location"]

    top_provider = get_provider_by_id(provider_id) or {}
    if not intent or not top_provider:
        raise HTTPException(status_code=400, detail="intent and valid provider_id are required")

    pricing = payload.get("pricing") or {}
    booking = create_booking_record(
        intent=intent,
        top_provider=top_provider,
        pricing=pricing,
        user_id=payload.get("user_id", "guest_user"),
        trace_log=payload.get("trace_log", []),
    )
    if booking.get("status") == "conflict":
        return {"booking": booking, "notifications": None}
    notifications = send_notifications(booking)
    return {"booking": booking, "notifications": notifications}


@app.post("/api/followup")
def api_followup(payload: dict[str, Any]) -> dict:
    booking_result = payload.get("booking") or {
        "booking_id": payload.get("booking_id"),
        "provider_name": payload.get("provider_name"),
        "booking_data": payload.get("booking_data", {}),
    }
    if not booking_result.get("booking_id"):
        raise HTTPException(status_code=400, detail="booking_id is required")
    return send_followup(booking_result, payload.get("status", "completed"))


@app.post("/api/dispute")
def api_dispute(payload: dict[str, Any]) -> dict:
    booking_id = payload.get("booking_id")
    dispute_type = payload.get("dispute_type")
    if not booking_id or not dispute_type:
        raise HTTPException(status_code=400, detail="booking_id and dispute_type are required")
    return resolve_dispute(
        booking_id=booking_id,
        complaint=payload.get("complaint", ""),
        dispute_type=dispute_type,
        user_id=payload.get("user_id", "anonymous"),
        amount_paid=int(payload.get("amount_paid", 0)),
    )


@app.get("/api/trace/{booking_id}")
def api_trace(booking_id: str) -> dict:
    booking = get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="booking not found")
    return {
        "booking_id": booking_id,
        "trace_log": booking.get("trace_log", []),
    }


@app.get("/api/providers")
def api_providers(service_type: str | None = None, area: str | None = None) -> dict:
    return {"providers": get_providers(service_type=service_type, area=area)}


@app.get("/api/health")
def api_health() -> dict:
    return {"status": "ok"}
