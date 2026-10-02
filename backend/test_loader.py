from rag.loaders.document_loader import load_pdf


pdf_path = "data/uploads/test.pdf"

text = load_pdf(pdf_path)

print("========== EXTRACTED TEXT ==========")
print(text[:2000])
print("====================================")