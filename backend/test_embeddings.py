from rag.loaders.document_loader import load_pdf
from rag.embeddings.embedding_model import get_embedding
from rag.retrieval.retriever import Retriever


# 1. Load PDF
pdf_path = "data/uploads/test.pdf"

chunks = load_pdf(pdf_path)

print("Total chunks:", len(chunks))


# 2. Create embeddings for every chunk
print("\nCreating embeddings...")

embeddings = []

for i, chunk in enumerate(chunks):
    embedding = get_embedding(chunk["text"])
    embeddings.append(embedding)

    print(f"Embedded chunk {i + 1}/{len(chunks)}")


# 3. Build FAISS index
print("\nBuilding FAISS index...")

retriever = Retriever()

retriever.build_index(
    chunks,
    embeddings
)

print("FAISS index created successfully!")


# 4. Test a question
question = "What is artificial intelligence?"

question_embedding = get_embedding(question)

results = retriever.search(
    question_embedding,
    top_k=3
)


# 5. Display retrieved chunks
print("\nRetrieved chunks:")

for i, result in enumerate(results):
    print(f"\n--- Result {i + 1} ---")
    print("Page:", result["page"])
    print(result["text"][:500])