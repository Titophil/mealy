from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from routes.admin_routes import admin_bp
from routes.payment_routes import payment_bp
from extensions import db  
from dotenv import load_dotenv
import os

load_dotenv()

migrate = Migrate()
jwt = JWTManager()

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

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(payment_bp)

    return app  # ✅ Make sure to return the app!

# ✅ Create app instance
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask,jsonify
from flask_cors import CORS
from config import Config
from extensions import db, migrate, jwt


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
    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to Mealy API!"})




    from routes.Menu import menu_bp
    app.register_blueprint(menu_bp,url_prefix='/menus')


    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
