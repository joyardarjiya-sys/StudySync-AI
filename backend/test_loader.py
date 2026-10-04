from rag.loaders.document_loader import load_pdf

pdf_path = "data/uploads/test.pdf"

chunks = load_pdf(pdf_path)

print("Total chunks:", len(chunks))

for i, chunk in enumerate(chunks[:3]):
    print(f"\n--- Chunk {i + 1} ---")
    print("Page:", chunk["page"])
    print(chunk["text"][:500])