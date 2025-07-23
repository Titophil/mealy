from flask import Flask
from dotenv import load_dotenv
from config import Config
from extensions import db, migrate, jwt, cors

# Load environment variables
load_dotenv()

# Import Blueprints
from routes.order_routes import order_bp
from routes.auth_routes import auth_bp
from routes.menu_routes import menu_bp
from routes.admin_routes import admin_bp
from routes.payment_routes import payment_bp
from routes.user_routes import user_bp
from routes.meal_routes import meal_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    # Register Blueprints
    app.register_blueprint(order_bp, url_prefix='/orders')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(menu_bp, url_prefix='/menus')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(payment_bp, url_prefix='/payments')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(meal_bp, url_prefix='/meals')

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
