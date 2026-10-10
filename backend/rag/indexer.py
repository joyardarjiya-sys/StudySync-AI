
import os
import pickle

import faiss
import numpy as np

from backend.rag.loaders.document_loader import load_pdf
from backend.rag.embeddings.embedding_model import get_embedding


PDF_PATH = "data/uploads/test.pdf"

INDEX_DIR = "data/index"
INDEX_PATH = os.path.join(INDEX_DIR, "faiss.index")
DOCUMENTS_PATH = os.path.join(INDEX_DIR, "documents.pkl")


def build_index():

    print("================================")
    print("StudySync AI - Building Index")
    print("================================")

    # Create index directory
    os.makedirs(INDEX_DIR, exist_ok=True)

    # -----------------------------
    # Load PDF
    # -----------------------------

    print("\nLoading PDF...")

    documents = load_pdf(PDF_PATH)

    print(f"Loaded {len(documents)} chunks.")

    if not documents:
        raise ValueError("No content found in the PDF.")

    # -----------------------------
    # Create embeddings
    # -----------------------------

    print("\nCreating embeddings...")

    embeddings = []

    for i, document in enumerate(documents):

        embedding = get_embedding(document["text"])

        embeddings.append(embedding)

        print(f"Embedded {i + 1}/{len(documents)}")

    # -----------------------------
    # Convert embeddings to numpy
    # -----------------------------

    embeddings = np.array(
        embeddings,
        dtype="float32"
    )

    # -----------------------------
    # Create FAISS index
    # -----------------------------

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    # -----------------------------
    # Save FAISS index
    # -----------------------------

    faiss.write_index(
        index,
        INDEX_PATH
    )

    # -----------------------------
    # Save documents
    # -----------------------------

    with open(DOCUMENTS_PATH, "wb") as f:

        pickle.dump(
            documents,
            f
        )

    print("\n================================")
    print("Index created successfully!")
    print("================================")

    print(f"\nFAISS index:")
    print(INDEX_PATH)

    print(f"\nDocuments:")
    print(DOCUMENTS_PATH)


if __name__ == "__main__":

    build_index()

