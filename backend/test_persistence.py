from rag.loaders.document_loader import load_pdf
from rag.embeddings.embedding_model import get_embedding
from rag.retrieval.retriever import Retriever


# --------------------------------
# STEP 1: Load PDF
# --------------------------------

pdf_path = "data/uploads/test.pdf"

chunks = load_pdf(pdf_path)

print("Total chunks:", len(chunks))


# --------------------------------
# STEP 2: Create embeddings
# --------------------------------

print("\nCreating embeddings...")

embeddings = []

for i, chunk in enumerate(chunks):

    embedding = get_embedding(chunk["text"])

    embeddings.append(embedding)

    print(f"Embedded {i + 1}/{len(chunks)}")


# --------------------------------
# STEP 3: Build FAISS
# --------------------------------

retriever = Retriever()

retriever.build_index(
    chunks,
    embeddings
)

print("\nFAISS index created.")


# --------------------------------
# STEP 4: Save
# --------------------------------

index_path = "rag/storage/faiss.index"
documents_path = "rag/storage/documents.pkl"

retriever.save(
    index_path,
    documents_path
)

print("FAISS index saved.")
print("Documents saved.")


# --------------------------------
# STEP 5: Create NEW retriever
# --------------------------------

new_retriever = Retriever()

new_retriever.load(
    index_path,
    documents_path
)

print("\nFAISS index loaded successfully.")


# --------------------------------
# STEP 6: Test retrieval
# --------------------------------

question = "What is artificial intelligence?"

question_embedding = get_embedding(question)

results = new_retriever.search(
    question_embedding,
    top_k=3
)


print("\nRetrieved results:")

for i, result in enumerate(results):

    print(f"\n--- Result {i + 1} ---")

    print("Page:", result["page"])

    print(result["text"][:300])