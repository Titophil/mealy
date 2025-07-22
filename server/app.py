from flask import Flask
from config import Config
from extensions import db, migrate, jwt, cors
from routes.Order_routes import order_bp

# You can also import and register other blueprints here when ready:
# from routes.auth import auth_bp
# from routes.menus import menu_bp
# from routes.admin import admin_bp

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

if __name__ == "__main__":
    app.run(debug=True)
