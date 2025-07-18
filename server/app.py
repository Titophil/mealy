from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from extensions import db, migrate, jwt
from routes.meal_routes import meal_bp


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:1234@localhost:5432/mealy')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_SECRET_KEY"] = "super-secret" 

    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    @app.route('/')
    def home():
        return "Welcome here"

    
    app.register_blueprint(meal_bp, url_prefix='/api')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
