from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


UPLOAD_DIR = BASE_DIR / "data" / "uploads"
CHROMA_DIR = BASE_DIR / "chroma_db"


UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR.mkdir(parents=True, exist_ok=True)


# =========================
# RAG SETTINGS
# =========================

CHUNK_SIZE = 800

CHUNK_OVERLAP = 150

TOP_K = 4

EMBEDDING_MODEL = "all-MiniLM-L6-v2"