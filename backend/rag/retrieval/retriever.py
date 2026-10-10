
import json
from pathlib import Path

import faiss
import numpy as np


class Retriever:

    def __init__(self, index_path, metadata_path):

        self.index_path = Path(index_path)
        self.metadata_path = Path(metadata_path)

        self.index = None
        self.metadata = []

    # =========================
    # BUILD INDEX
    # =========================

    def build_index(self, embeddings, chunks):

        """
        Create a completely new FAISS index.
        The previous index is replaced.
        """

        print("\n" + "=" * 50)
        print("BUILDING NEW VECTOR INDEX")
        print("=" * 50)

        if not chunks:
            raise ValueError(
                "No chunks were provided."
            )

        embeddings = np.asarray(
            embeddings,
            dtype="float32"
        )

        if embeddings.ndim != 2:
            raise ValueError(
                f"Invalid embedding shape: {embeddings.shape}"
            )

        dimension = embeddings.shape[1]

        # Create NEW index
        self.index = faiss.IndexFlatIP(
            dimension
        )

        # Add ONLY the new embeddings
        self.index.add(
            embeddings
        )

        # Replace metadata
        self.metadata = list(chunks)

        print(
            f"New FAISS index created."
        )

        print(
            f"Embedding dimension: {dimension}"
        )

        print(
            f"Number of vectors: {self.index.ntotal}"
        )

        print(
            f"Number of metadata chunks: {len(self.metadata)}"
        )

        # Show which files are actually being indexed
        sources = set()

        for chunk in self.metadata:

            if "source" in chunk:
                sources.add(
                    chunk["source"]
                )

        print(
            f"Sources in new index: {list(sources)}"
        )

        print("=" * 50)

    # =========================
    # SAVE
    # =========================

    def save(self):

        """
        Save FAISS index and metadata.
        """

        if self.index is None:
            raise ValueError(
                "Cannot save an empty index."
            )

        self.index_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        # Save FAISS index
        faiss.write_index(
            self.index,
            str(self.index_path)
        )

        # Save metadata
        with open(
            self.metadata_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                self.metadata,
                file,
                indent=2,
                ensure_ascii=False
            )

        print("\nIndex and metadata saved.")

        print(
            f"Index: {self.index_path}"
        )

        print(
            f"Metadata: {self.metadata_path}"
        )

    # =========================
    # LOAD
    # =========================

    def load(self):

        """
        Load existing FAISS index and metadata.
        """

        if not self.index_path.exists():

            print(
                "\nNo existing FAISS index found."
            )

            return False

        if not self.metadata_path.exists():

            print(
                "\nNo existing metadata found."
            )

            return False

        self.index = faiss.read_index(
            str(self.index_path)
        )

        with open(
            self.metadata_path,
            "r",
            encoding="utf-8"
        ) as file:

            self.metadata = json.load(
                file
            )

        print("\nExisting index loaded.")

        print(
            f"Vectors: {self.index.ntotal}"
        )

        print(
            f"Metadata chunks: {len(self.metadata)}"
        )

        sources = set()

        for chunk in self.metadata:

            if "source" in chunk:
                sources.add(
                    chunk["source"]
                )

        print(
            f"Sources in loaded index: {list(sources)}"
        )

        return True

    # =========================
    # SEARCH
    # =========================

    def search(
        self,
        query_embedding,
        top_k=3
    ):

        """
        Find the most relevant chunks.
        """

        if self.index is None:

            raise ValueError(
                "Index is not loaded."
            )

        # Don't request more results
        # than actually exist
        k = min(
            top_k,
            self.index.ntotal
        )

        if k == 0:
            return []

        query_embedding = np.asarray(
            [query_embedding],
            dtype="float32"
        )

        scores, indices = self.index.search(
            query_embedding,
            k
        )

        results = []

        for score, index in zip(
            scores[0],
            indices[0]
        ):

            if index == -1:
                continue

            result = self.metadata[
                index
            ].copy()

            result["score"] = float(
                score
            )

            results.append(
                result
            )

        return results
