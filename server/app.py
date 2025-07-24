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
from .commands import seed

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Load additional credentials from .env
    app.config['DARAJA_CONSUMER_KEY'] = os.getenv('DARAJA_CONSUMER_KEY')
    app.config['DARAJA_CONSUMER_SECRET'] = os.getenv('DARAJA_CONSUMER_SECRET')
    app.config['DARAJA_SHORTCODE'] = os.getenv('DARAJA_SHORTCODE')
    app.config['SPOONACULAR_API_KEY'] = os.getenv('SPOONACULAR_API_KEY')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Enable CORS for frontend on localhost:5173
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # Register route blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')        # Handles signup/login
    app.register_blueprint(user_bp, url_prefix='/users')       # Handles user profile and data
    app.register_blueprint(admin_bp, url_prefix='/admin')      # Admin functionalities
    app.register_blueprint(menu_bp, url_prefix='/menus')       # Menus for the day or week
    app.register_blueprint(meal_bp, url_prefix='/meals')       # Meals and meal options
    app.register_blueprint(payment_bp, url_prefix='/payments') # Payment processing

    # Home route
    @app.route("/")
    def home():
        return jsonify(message="Welcome to the Mealy API 🚀"), 200

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
