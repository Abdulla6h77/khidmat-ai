import os
import asyncio
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY", "")
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"

from google.adk import Agent, Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

async def main():
    agent = Agent(
        name="test_agent",
        model="openai/gpt-4o-mini",
        instruction="You are a helpful assistant. Reply briefly.",
    )

    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name="khidmat_ai", user_id="test_user"
    )

    runner = Runner(
        agent=agent,
        app_name="khidmat_ai",
        session_service=session_service,
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text="Hello! Who are you?")]
    )

    final_response = ""
    async for event in runner.run_async(
        user_id="test_user",
        session_id=session.id,
        new_message=content,
    ):
        if event.is_final_response() and event.content:
            for part in event.content.parts:
                if hasattr(part, "text"):
                    final_response += part.text

    print("Response:", final_response)

if __name__ == "__main__":
    asyncio.run(main())
