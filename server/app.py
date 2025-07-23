from flask import Flask
from config import Config
from extensions import db, migrate, jwt, cors
from routes.Order_routes import order_bp

<<<<<<< HEAD
# You can also import and register other blueprints here when ready:
# from routes.auth import auth_bp
# from routes.menus import menu_bp
# from routes.admin import admin_bp
=======
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask_migrate import Migrate

migrate = Migrate()

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
>>>>>>> origin/neema

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
    # app.register_blueprint(auth_bp, url_prefix='/auth')
    # app.register_blueprint(menu_bp, url_prefix='/menus')
    # app.register_blueprint(admin_bp, url_prefix='/admin')

    return app

app = create_app()
<<<<<<< HEAD

if __name__ == "__main__":
=======
migrate.init_app(app, db)
if __name__ == '__main__':
>>>>>>> origin/neema
    app.run(debug=True)
