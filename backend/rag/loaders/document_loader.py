from pathlib import Path
from pypdf import PdfReader


def load_pdf(file_path: str):
    """
    Extract text from a PDF page by page.
    """

    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(
            f"PDF not found: {file_path}"
        )

    reader = PdfReader(str(file_path))

    documents = []

    for page_number, page in enumerate(reader.pages, start=1):

        text = page.extract_text()

        if text and text.strip():

            documents.append({
                "text": text.strip(),
                "page": page_number,
                "source": file_path.name
            })

    return documents


def chunk_documents(
    documents,
    chunk_size: int = 500,
    chunk_overlap: int = 50
):
    """
    Split documents into overlapping chunks.
    """

    chunks = []
    chunk_id = 0

    for document in documents:

        text = document["text"]

        start = 0

        while start < len(text):

            end = start + chunk_size

            chunk_text = text[start:end].strip()

            if chunk_text:

                chunks.append({
                    "chunk_id": chunk_id,
                    "text": chunk_text,
                    "page": document["page"],
                    "source": document["source"]
                })

                chunk_id += 1

            start += chunk_size - chunk_overlap

    return chunks