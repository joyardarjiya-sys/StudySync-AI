import chromadb
from pathlib import Path

CHROMA_PATH = Path("data/chroma")

client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)

collection = client.get_or_create_collection(
    name="studysync_documents"
)


def add_chunks(chunks, embeddings):
    ids = [f"chunk_{i}" for i in range(len(chunks))]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings
    )


def search_chunks(query_embedding, top_k=5):
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results