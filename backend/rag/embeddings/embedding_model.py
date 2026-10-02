from sentence_transformers import SentenceTransformer

from rag.config import EMBEDDING_MODEL


# Load embedding model
model = SentenceTransformer(EMBEDDING_MODEL)


def create_embeddings(chunks: list[str]):
    """
    Convert text chunks into numerical vectors.
    """

    if not chunks:
        return []

    embeddings = model.encode(
        chunks,
        convert_to_numpy=True
    )

    return embeddings