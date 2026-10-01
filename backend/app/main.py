from fastapi import FastAPI

app = FastAPI(
    title="Personalized Tutoring & Adaptive Learning API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Personalized Tutoring Backend is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }