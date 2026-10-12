from pathlib import Path

# =========================
# BASE DIRECTORIES
# =========================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"

UPLOAD_DIR = DATA_DIR / "uploads"

INDEX_DIR = DATA_DIR / "index"


# =========================
# RAG SETTINGS
# =========================

CHUNK_SIZE = 500

CHUNK_OVERLAP = 50

TOP_K = 3


# =========================
# EMBEDDING MODEL
# =========================

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


# =========================
# GEMINI MODEL
# =========================

GEMINI_MODEL = "gemini-2.5-flash"


# =========================
# CREATE DIRECTORIES
# =========================

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

INDEX_DIR.mkdir(parents=True, exist_ok=True)