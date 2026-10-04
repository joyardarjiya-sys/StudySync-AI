import faiss
import numpy as np
import pickle
import os


class Retriever:

    def __init__(self):
        self.index = None
        self.documents = []

    def build_index(self, documents, embeddings):
        """
        Build a FAISS index from document embeddings.
        """

        embeddings = np.array(embeddings).astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(embeddings)

        self.documents = documents

    def search(self, query_embedding, top_k=3):
        """
        Search for the most relevant documents.
        """

        query_embedding = np.array(
            [query_embedding]
        ).astype("float32")

        distances, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for index in indices[0]:

            if index < len(self.documents):
                results.append(self.documents[index])

        return results

    def save(self, index_path, documents_path):
        """
        Save FAISS index and document metadata.
        """

        if self.index is None:
            raise ValueError("FAISS index has not been built.")

        faiss.write_index(
            self.index,
            index_path
        )

        with open(documents_path, "wb") as file:

            pickle.dump(
                self.documents,
                file
            )

    def load(self, index_path, documents_path):
        """
        Load FAISS index and document metadata.
        """

        if not os.path.exists(index_path):
            raise FileNotFoundError(
                f"FAISS index not found: {index_path}"
            )

        if not os.path.exists(documents_path):
            raise FileNotFoundError(
                f"Documents file not found: {documents_path}"
            )

        self.index = faiss.read_index(
            index_path
        )

        with open(documents_path, "rb") as file:

            self.documents = pickle.load(file)