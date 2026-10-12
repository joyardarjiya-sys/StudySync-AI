from backend.rag.loaders.document_loader import load_pdf
from backend.rag.processing.chunker import chunk_text


pdf_path = "data/uploads/test.pdf"

# Step 1: Load PDF
text = load_pdf(pdf_path)

print(f"Total characters: {len(text)}")


# Step 2: Create chunks
chunks = chunk_text(text)

print(f"Total chunks: {len(chunks)}")


# Step 3: Display chunks
for i, chunk in enumerate(chunks):

    print("\n" + "=" * 60)
    print(f"CHUNK {i + 1}")
    print("=" * 60)

    print(chunk)