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
