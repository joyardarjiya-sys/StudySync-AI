from rag.config import CHUNK_SIZE, CHUNK_OVERLAP


def chunk_text(text, page_number=None):
    """
    Split text into overlapping chunks.
    """

    chunks = []

    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE

        chunk = text[start:end].strip()

        if chunk:
            chunks.append({
                "text": chunk,
                "page": page_number
            })

        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks