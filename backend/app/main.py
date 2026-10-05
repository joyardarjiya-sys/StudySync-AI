
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from pathlib import Path
import shutil

from rag.pipeline import RAGPipeline


# =========================
# APP
# =========================

app = FastAPI(
    title="StudySync AI",
    description="RAG-based AI Tutor API",
    version="1.0.0"
)


# =========================
# UPLOAD DIRECTORY
# =========================

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# =========================
# LOAD RAG PIPELINE
# =========================

print("\nStarting StudySync AI...\n")

rag = RAGPipeline()

# Load previously created vector index
rag.load_existing_index()


# =========================
# REQUEST MODEL
# =========================

class QuestionRequest(BaseModel):
    question: str


# =========================
# ROOT
# =========================

@app.get("/")
def root():

    return {
        "message": "StudySync AI is running"
    }


# =========================
# ASK QUESTION
# =========================

@app.post("/ask")
def ask_question(request: QuestionRequest):

    result = rag.ask(
        request.question
    )

    return result


# =========================
# UPLOAD PDF
# =========================

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if not file.filename:
        return {
            "message": "No file provided"
        }

    if not file.filename.lower().endswith(".pdf"):
        return {
            "message": "Only PDF files are supported"
        }

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )
    print("\n" + "=" * 50)
    print(f"UPLOADED: {file.filename}")
    print(f"PATH: {file_path}")
    print("=" * 50)

    try:
        pdf_files = list(UPLOAD_DIR.glob("*.pdf"))

        print("\nPDFs currently in knowledge base:")
        for pdf in pdf_files:
            print(f"- {pdf.name}")

        rag.build_index(pdf_files)

    except Exception as e:
        print(f"\nINDEXING ERROR: {e}")
        return {
            "message": "PDF uploaded but indexing failed",
            "filename": file.filename,
            "error": str(e)
        }

    sources = set()

    for chunk in rag.retriever.metadata:

        if "source" in chunk:
            sources.add(
                chunk["source"]
            )

    print("\nCURRENT INDEX SOURCES:")
    print(sources)

    return {
        "message": "PDF uploaded and indexed successfully",
        "filename": file.filename,
        "indexed_sources": list(sources)
    }