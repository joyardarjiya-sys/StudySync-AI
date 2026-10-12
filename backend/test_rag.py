from backend.rag.pipeline import ask_question


# --------------------------------
# Saved FAISS files
# --------------------------------

index_path = "rag/storage/faiss.index"
documents_path = "rag/storage/documents.pkl"


# --------------------------------
# Ask question
# --------------------------------

question = "What is artificial intelligence?"


print("\n================================")
print("STUDYSYNC AI")
print("================================")

print("\nQuestion:")
print(question)

print("\nGenerating answer...\n")


answer = ask_question(
    question,
    index_path,
    documents_path
)


print("================================")
print("ANSWER")
print("================================")

print(answer)