# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
<<<<<<< HEAD
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
=======
    SQLALCHEMY_DATABASE_URI =  "postgresql://postgres:postgres@localhost:5432/mealy"
>>>>>>> origin/neema
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # Optional: Add other variables if needed
    CONSUMER_KEY = os.getenv("CONSUMER_KEY")
    CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
    DARAJA_SHORTCODE = os.getenv("DARAJA_SHORTCODE")
    PASSKEY = os.getenv("PASSKEY")
    CALLBACK_URL = os.getenv("CALLBACK_URL")
