import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///dermadetect.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)

    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY = {
        "broker_url": REDIS_URL,
        "result_backend": REDIS_URL,
        "task_always_eager": os.getenv("CELERY_TASK_ALWAYS_EAGER", "false").lower() == "true",
    }

    MEDSIGLIP_MODEL_PATH = os.getenv("MEDSIGLIP_MODEL_PATH", "./models/medsiglip_local.onnx")
