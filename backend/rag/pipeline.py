from pathlib import Path

from backend.rag.config import (
    UPLOAD_DIR,
    INDEX_DIR,
    CHUNK_SIZE,
    CHUNK_OVERLAP,
    TOP_K
)

from backend.rag.loaders.document_loader import (
    load_pdf,
    chunk_documents
)

from backend.rag.embeddings.embedding_model import (
    EmbeddingModel
)

from backend.rag.retrieval.retriever import (
    Retriever
)

from backend.rag.generation.llm import (
    GeminiLLM
)


# =========================
# INDEX FILES
# =========================

INDEX_PATH = INDEX_DIR / "studysync.index"

METADATA_PATH = INDEX_DIR / "metadata.json"


class RAGPipeline:

    def __init__(self):

        print("\nInitializing StudySync AI...\n")

        self.embedding_model = EmbeddingModel()

        self.retriever = Retriever(
            INDEX_PATH,
            METADATA_PATH
        )

        self.llm = GeminiLLM()

    # =========================
    # BUILD KNOWLEDGE BASE
    # =========================

    def build_index(self, pdf_paths):
        all_chunks = []

        for pdf_path in pdf_paths:
            print("\n" + "=" * 50)
            print(f"Loading PDF: {pdf_path.name}")
            print("=" * 50)

            documents = load_pdf(pdf_path)

            print(f"Loaded {len(documents)} pages.")

            print("\nCreating chunks...")
            chunks = chunk_documents(
                documents,
                CHUNK_SIZE,
                CHUNK_OVERLAP
            )

            print(f"Created {len(chunks)} chunks.")

            all_chunks.extend(chunks)

        print("\n" + "=" * 50)
        print(f"TOTAL CHUNKS FROM ALL PDFs: {len(all_chunks)}")
        print("=" * 50)

        texts = [chunk["text"] for chunk in all_chunks]

        print("\nCreating embeddings...")
        embeddings = self.embedding_model.embed_documents(texts)

        print("Embeddings created.")

        self.retriever.build_index(
            embeddings,
            all_chunks
        )

        self.retriever.save()

        print("\nKnowledge base created successfully.")
    # =========================
    # LOAD EXISTING INDEX
    # =========================

    def load_existing_index(self):

        return self.retriever.load()

    # =========================
    # ASK QUESTION
    # =========================

    def ask(self, question):

        # Create embedding for question
        query_embedding = (
            self.embedding_model
            .embed_query(question)
        )

        # Search relevant chunks
        results = self.retriever.search(
            query_embedding,
            TOP_K
        )

        if not results:

            return {
                "answer": (
                    "I couldn't find relevant "
                    "information in your study material."
                ),
                "sources": []
            }

        # Build context
        context_parts = []

        sources = []

        for result in results:

            context_parts.append(
                result["text"]
            )

            sources.append({
                "source": result["source"],
                "page": result["page"],
                "score": result["score"]
            })

        context = "\n\n".join(
            context_parts
        )

        # Generate answer
        answer = self.llm.generate(
            question,
            context
        )

        return {
            "answer": answer,
            "sources": sources
        }


# =========================
# RUN FROM TERMINAL
# =========================

if __name__ == "__main__":

    pipeline = RAGPipeline()

    # Try loading existing index
    index_exists = (
        pipeline.load_existing_index()
    )

    # If no index exists, build one
    if not index_exists:

        pdf_files = list(
            Path(UPLOAD_DIR).glob("*.pdf")
        )

        if not pdf_files:

            print(
                "\nNo PDF found in:"
            )

            print(UPLOAD_DIR)

            print(
                "\nPut a PDF inside the uploads folder."
            )

            raise SystemExit

        # Use the first PDF for now
        pdf_path = pdf_files[0]

        pipeline.build_index(
            pdf_path
        )

    # Ask question
    question = input(
        "\nAsk StudySync AI: "
    )

    result = pipeline.ask(
        question
    )

    print("\n")
    print("=" * 50)
    print("STUDYSYNC AI")
    print("=" * 50)

    print("\nAnswer:\n")

    print(result["answer"])

    print("\nSources:\n")

    for source in result["sources"]:

        print(
            f"- {source['source']} "
            f"(Page {source['page']}) "
            f"[score: {source['score']:.3f}]"
        )
