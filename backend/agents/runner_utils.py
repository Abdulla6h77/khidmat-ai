"""
Shared ADK runner utility for KhidmatAI agents.
All agents use OpenRouter (GPT-4o-mini) via LiteLLM.
"""
import os
import asyncio
from pathlib import Path
from typing import Any
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BACKEND_DIR / ".env")

# Configure LiteLLM to use OpenRouter
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY", "")
os.environ["OPENAI_API_BASE"] = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")

from google.adk import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
APP_NAME = "khidmat_ai"


async def run_agent(agent, user_input: str, user_id: str = "default") -> str:
    """Run an ADK agent with the given input and return the final text response."""
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name=APP_NAME, user_id=user_id
    )

    runner = Runner(
        agent=agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=user_input)]
    )

    final_response = ""
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session.id,
        new_message=content,
    ):
        if event.is_final_response() and event.content:
            for part in event.content.parts:
                if hasattr(part, "text") and part.text:
                    final_response += part.text

    return final_response.strip()


def run_agent_sync(agent, user_input: str, user_id: str = "default") -> str:
    """Synchronous wrapper around run_agent."""
    return asyncio.run(run_agent(agent, user_input, user_id))
