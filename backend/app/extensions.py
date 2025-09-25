from celery import Celery
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from .config import Config


def make_celery() -> Celery:
    celery = Celery(__name__)
    celery.conf.update(Config.CELERY)
    return celery


db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
jwt = JWTManager()
celery_app = make_celery()
