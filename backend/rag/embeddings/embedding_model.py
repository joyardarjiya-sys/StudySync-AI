from sentence_transformers import SentenceTransformer

from rag.config import EMBEDDING_MODEL


class EmbeddingModel:

    def __init__(self):
        print("Loading embedding model...")

        self.model = SentenceTransformer(
            EMBEDDING_MODEL
        )

        print("Embedding model loaded.")

    def embed_documents(self, texts):
        """
        Create embeddings for multiple document chunks.
        """

        return self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

    def embed_query(self, query):
        """
        Create an embedding for a user's question.
        """

        return self.model.encode(
            [query],
            convert_to_numpy=True,
            normalize_embeddings=True
        )[0]