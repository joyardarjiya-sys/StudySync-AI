def build_prompt(question, context):
    return f"""
You are StudySync AI, an educational AI tutor.

Answer the user's question using ONLY the provided context.

If the answer cannot be found in the context, say:
"I couldn't find this information in the provided study material."

Context:
{context}

Question:
{question}

Answer:
"""


def generate_answer(question, retrieved_chunks, llm):
    context = "\n\n".join(retrieved_chunks)

    prompt = build_prompt(
        question=question,
        context=context
    )

    response = llm.generate_content(prompt)

    return response.text