from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging



from server.config import Config
from server.extensions import db, migrate, jwt
from server.routes.admin_routes import admin_bp
from server.routes.payment_routes import payment_bp
from server.routes.auth_routes import auth_bp
from server.routes.user_routes import user_bp
from server.routes.Menu import menu_bp
from server.routes.order_routes import order_bp
from server.routes.meal_routes import meal_bp
from server.commands import seed

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_jwt_secret')
    print(f"Loaded SECRET_KEY: {app.config['SECRET_KEY']}") 

    app.config['DARAJA_CONSUMER_KEY'] = os.getenv('DARAJA_CONSUMER_KEY')
    app.config['DARAJA_CONSUMER_SECRET'] = os.getenv('DARAJA_CONSUMER_SECRET')
    app.config['DARAJA_SHORTCODE'] = os.getenv('DARAJA_SHORTCODE')
    app.config['SPOONACULAR_API_KEY'] = os.getenv('SPOONACULAR_API_KEY')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app, resources={r"/*": {"origins": "https://sweet-tuzt.onrender.com"}}, supports_credentials=True)

    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(menu_bp, url_prefix='/menus')
    app.register_blueprint(meal_bp, url_prefix='/meals')
    app.register_blueprint(payment_bp, url_prefix='/payments')
    app.register_blueprint(order_bp, url_prefix='/orders')  # Critical line

    @app.route("/")
    def home():
        return jsonify(message="Welcome to the Mealy API 🚀"), 200

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)