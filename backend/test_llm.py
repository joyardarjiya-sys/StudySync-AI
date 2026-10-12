from backend.rag.generation.llm import generate_answer


response = generate_answer(
    "Explain supervised learning in 3 simple sentences."
)

print(response)