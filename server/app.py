from flask import Flask, jsonify, make_response, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler
from .config import Config
from .extensions import db, jwt
from .routes.admin_routes import admin_bp
from .routes.payment_routes import payment_bp
from .routes.auth_routes import auth_bp, auth_fallback_bp
from .routes.user_routes import user_bp
from .routes.Menu import menu_bp
from .routes.order_routes import order_bp
from .routes.meal_routes import meal_bp
from .commands import seed

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_jwt_secret')

    handler = RotatingFileHandler('mealy.log', maxBytes=1000000, backupCount=5)
    handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    handler.setLevel(logging.DEBUG)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.DEBUG)
    app.logger.info('Mealy application started')

    app.config['DARAJA_CONSUMER_KEY'] = os.getenv('DARAJA_CONSUMER_KEY')
    app.config['DARAJA_CONSUMER_SECRET'] = os.getenv('DARAJA_CONSUMER_SECRET')
    app.config['DARAJA_SHORTCODE'] = os.getenv('DARAJA_SHORTCODE')
    app.config['SPOONACULAR_API_KEY'] = os.getenv('SPOONACULAR_API_KEY')

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt.init_app(app)

    CORS(app, resources={
        r"/*": {
            "origins": [
                "https://mealy-8-1cv8.onrender.com/",
                "https://sweet-tuzt.onrender.com",
                "http://localhost:5173"
            ],
            "supports_credentials": True,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(auth_fallback_bp, url_prefix='/auth')  # Fallback for /auth/signup
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(meal_bp, url_prefix='/api/meals')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(order_bp, url_prefix='/api/orders')

    # Catch-all OPTIONS handler
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        app.logger.debug(f"Handling OPTIONS request for /{path}")
        return make_response(), 200

    @app.route("/")
    def home():
        app.logger.info("Accessed root endpoint")
        return jsonify(message="Welcome to the Mealy API 🚀"), 200

    @app.route("/favicon.ico")
    def favicon():
        app.logger.info("Serving favicon.ico")
        return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/x-icon')

    @app.errorhandler(405)
    def method_not_allowed(error):
        app.logger.error(f"Method not allowed: {str(error)}")
        return jsonify({"error": "Method not allowed for this endpoint"}), 405

    @app.errorhandler(Exception)
    def handle_error(error):
        app.logger.error(f"Unhandled error: {str(error)}", exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_DEBUG', 'False') == 'True', port=int(os.getenv('PORT', 5000)))