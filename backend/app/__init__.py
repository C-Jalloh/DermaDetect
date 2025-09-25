from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate, ma, jwt, celery_app
from .routes.sync import sync_bp
from .routes.auth import auth_bp
from .routes.patients import patients_bp
from .routes.cases import cases_bp
from .routes.vitals import vitals_bp

def create_app(config_class: type[Config] | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class or Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    jwt.init_app(app)

    app.register_blueprint(sync_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(patients_bp, url_prefix="/api")
    app.register_blueprint(cases_bp, url_prefix="/api")
    app.register_blueprint(vitals_bp, url_prefix="/api")

    # Attach Flask context to Celery
    celery_app.conf.update(app.config)

    return app


__all__ = ["create_app", "db"]
