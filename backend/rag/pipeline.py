from rag.embeddings.embedding_model import get_embedding
from rag.generation.llm import generate_answer
from rag.retrieval.retriever import Retriever


def ask_question(question, index_path, documents_path):
    """
    Retrieve relevant chunks from the saved FAISS index
    and generate a source-aware answer.
    """

    # --------------------------------
    # Load saved FAISS index
    # --------------------------------

    retriever = Retriever()

    retriever.load(
        index_path,
        documents_path
    )

    # --------------------------------
    # Create embedding for question
    # --------------------------------

    question_embedding = get_embedding(question)

    # --------------------------------
    # Retrieve relevant chunks
    # --------------------------------

    relevant_chunks = retriever.search(
        question_embedding,
        top_k=3
    )

    # --------------------------------
    # Build context
    # --------------------------------

    context_parts = []

    for i, chunk in enumerate(relevant_chunks, start=1):

        context_parts.append(
            f"""
SOURCE {i}
Page: {chunk['page']}

{chunk['text']}
"""
        )

    context = "\n\n".join(context_parts)

    # --------------------------------
    # Build RAG prompt
    # --------------------------------

    prompt = f"""
You are StudySync AI, an AI tutor.

Answer the user's question using ONLY the study material provided below.

STUDY MATERIAL:
{context}

USER QUESTION:
{question}

INSTRUCTIONS:

1. Give a clear and accurate answer.
2. Explain the concept in a student-friendly way.
3. Do not invent information.
4. If the answer cannot be found in the study material, say:
   "I couldn't find enough information in the provided study material."
5. At the end, provide the source pages used.
6. Use this format:

Answer:
[your answer]

Sources:
- Page X
- Page Y

Only mention pages that actually support your answer.
"""

    # --------------------------------
    # Generate answer
    # --------------------------------

    answer = generate_answer(prompt)

    return answer

if __name__ == "__main__":

    print("================================")
    print("StudySync AI RAG Pipeline")
    print("================================")

    question = input("\nAsk a question about your study material:\n> ")

    answer = ask_question(
        question=question,
        index_path="data/index/faiss.index",
        documents_path="data/index/documents.pkl"
    )

    print("\n================================")
    print("ANSWER")
    print("================================")
    print(answer)

