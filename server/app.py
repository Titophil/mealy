# server/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Local imports
from .config import Config
from .extensions import db, migrate, jwt
from .routes.admin_routes import admin_bp
from .routes.payment_routes import payment_bp
from .routes.auth_routes import auth_bp
from .routes.user_routes import user_bp
from .routes.Menu import menu_bp
from .routes.meal_routes import meal_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Optional Daraja config from .env
    app.config['DARAJA_CONSUMER_KEY'] = os.getenv('DARAJA_CONSUMER_KEY')
    app.config['DARAJA_CONSUMER_SECRET'] = os.getenv('DARAJA_CONSUMER_SECRET')
    app.config['DARAJA_SHORTCODE'] = os.getenv('DARAJA_SHORTCODE')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(menu_bp, url_prefix='/menus')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(meal_bp, url_prefix='/api')
    app.register_blueprint(payment_bp)

    # Health check route
    @app.route("/")
    def home():
        return jsonify(message="Welcome to the Mealy API 🚀"), 200

    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
