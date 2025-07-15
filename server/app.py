from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints (empty for now)
    # from routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
