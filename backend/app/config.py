from dotenv import load_dotenv
import os

load_dotenv()

APP_NAME = "Personalized Tutoring & Adaptive Learning"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")