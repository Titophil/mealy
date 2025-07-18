from flask import Flask, jsonify 
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from models.user import User, db, bcrypt 
from dotenv import load_dotenv
import os 
from utils.utils import admin_required 



app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

load_dotenv()

with app.app_context():
    db.create_all()

from routes.auth_routes import auth_bp
from routes.user_routes import user_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')

if __name__ == '__main__':
    app.run(debug=True) 
