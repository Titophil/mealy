from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from server.config import Config
from server.extensions import db, migrate, jwt
from server.routes.admin_routes import admin_bp
from server.routes.payment_routes import payment_bp
from server.routes.auth_routes import auth_bp
from server.routes.user_routes import user_bp
from server.routes.Menu import menu_bp
from server.routes.Order_routes import order_bp
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

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "expose_headers": ["Authorization"],
            "supports_credentials": True
        }
    })

    @app.before_request
    def log_and_handle_options():
        print(f"Request: {request.method} {request.url} Headers: {dict(request.headers)}")
        if request.method == "OPTIONS":
            print(f"Responding to OPTIONS for {request.url}")
            response = jsonify({})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response, 200

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(menu_bp, url_prefix='/menus')
    app.register_blueprint(meal_bp, url_prefix='/meals')
    app.register_blueprint(payment_bp, url_prefix='/payments')
    app.register_blueprint(order_bp, url_prefix='/')

    with app.app_context():
        print("Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"Endpoint: {rule.endpoint}, Path: {rule}")

    def api_route(f):
        from functools import wraps
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                response = f(*args, **kwargs)
                print(f"Response: {request.method} {request.url} Status: {response[1] if isinstance(response, tuple) else 200}")
                return response
            except Exception as e:
                print(f"API error: {str(e)}")
                return jsonify({"error": str(e)}), 500
        return decorated

    @app.route("/health")
    @api_route
    def health_check():
        return jsonify({"status": "healthy"}), 200

    @app.route("/")
    @api_route
    def home():
        return jsonify(message="Welcome to the Mealy API 🚀"), 200

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)