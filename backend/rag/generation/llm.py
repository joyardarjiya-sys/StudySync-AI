
import os
import time

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Check your backend/.env file."
    )


client = genai.Client(api_key=api_key)


def generate_answer(prompt: str) -> str:
    """
    Generate an answer using Gemini Chat API.
    """

    max_retries = 3

    for attempt in range(max_retries):

        try:

            chat = client.chats.create(
                model="gemini-3.8-flash"
            )

            response = chat.send_message(
                message=prompt
            )

            if response.text:
                return response.text

            return "Gemini returned an empty response."

        except Exception as e:

            error_message = str(e)

            print(f"Gemini error: {error_message}")

            # Retry temporary connection/server errors
            retryable = (
                "503" in error_message
                or "UNAVAILABLE" in error_message
                or "10053" in error_message
                or "ReadError" in error_message
            )

            if not retryable:
                raise

            if attempt == max_retries - 1:
                return (
                    "Gemini is temporarily unavailable. "
                    "Please try again in a moment."
                )

            wait_time = 2 ** attempt

            print(
                f"Retrying Gemini in {wait_time} seconds..."
            )

            time.sleep(wait_time)
