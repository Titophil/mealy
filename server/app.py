from flask import Flask,jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from routes.Menu import menu_bp
from routes.admin_routes import admin_bp
from routes.payment_routes import payment_bp
from extensions import db, migrate, jwt
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)

    # ✅ Define the route INSIDE the create_app function
    @app.route("/")
    def home():
        return "Welcome to the Mealy API 🚀"

    app.config.from_object(Config)

    # Daraja Config
    app.config['DARAJA_CONSUMER_KEY'] = os.getenv('DARAJA_CONSUMER_KEY')
    app.config['DARAJA_CONSUMER_SECRET'] = os.getenv('DARAJA_CONSUMER_SECRET')
    app.config['DARAJA_SHORTCODE'] = os.getenv('DARAJA_SHORTCODE')

   
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(menu_bp,url_prefix='/menus')
    app.register_blueprint(payment_bp)


    return app  # ✅ Make sure to return the app!

# ✅ Create app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
