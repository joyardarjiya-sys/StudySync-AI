from pypdf import PdfReader
from rag.loaders.chunker import chunk_text


def load_pdf(file_path):
    """
    Load a PDF and split it into chunks while preserving page numbers.
    """

    reader = PdfReader(file_path)

    all_chunks = []

    for page_number, page in enumerate(reader.pages, start=1):

        text = page.extract_text()

        if not text:
            continue

        chunks = chunk_text(
            text,
            page_number=page_number
        )

        all_chunks.extend(chunks)

    return all_chunks