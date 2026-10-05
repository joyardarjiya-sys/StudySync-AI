import os

from dotenv import load_dotenv
from google import genai

from rag.config import GEMINI_MODEL


load_dotenv()


class GeminiLLM:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not set."
            )

        self.client = genai.Client(
            api_key=api_key
        )

    def generate(self, question, context):

        prompt = f"""
You are StudySync AI, an educational AI tutor.

Answer the student's question using ONLY the
provided study material.

Rules:
1. Do not invent information.
2. If the answer is not present in the material,
   say that you could not find it in the uploaded
   study material.
3. Explain concepts clearly and simply.
4. Use the context below as your primary source.

========================
STUDY MATERIAL
========================

{context}

========================
STUDENT QUESTION
========================

{question}

========================
ANSWER
========================
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )

        return response.text
