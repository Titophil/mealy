from flask import Blueprint, request, jsonify, make_response
from server.models.user import User
from server.models.caterer import Caterer
from server.extensions import db, bcrypt
from flask_jwt_extended import create_access_token
import logging

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@auth_bp.route('api/auth/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/auth/signup")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'https://mealy-12-fnkh.onrender.com'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 200

    try:
        data = request.get_json()
        if not data:
            logger.warning("Missing JSON in signup request")
            return jsonify({'error': 'Missing JSON in request'}), 400

        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()

        if not email or not password or not name:
            logger.warning("Missing required fields in signup")
            return jsonify({'error': 'Email, password, and name are required'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if not existing_user.role:
                db.session.delete(existing_user)
                db.session.commit()
            else:
                logger.warning(f"Email already exists: {email}")
                return jsonify({'error': 'Email already exists'}), 400

        role = 'admin' if email.endswith('@admin.gmail.com') else 'user'
        user = User(email=email, name=name, role=role)
        user.password = bcrypt.generate_password_hash(password).decode('utf-8')
        db.session.add(user)
        db.session.flush()

        if role == 'admin':
            caterer = Caterer(id=user.id, name=user.name, email=user.email, phone=phone or '', password=user.password)
            db.session.add(caterer)

        db.session.commit()

        access_token = create_access_token(identity={
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role
        })

        logger.info(f"User signed up: {email}")
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error during signup: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error during signup: {str(e)}'}), 500

@auth_bp.route('api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/auth/login")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'https://mealy-12-fnkh.onrender.com'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 200

    try:
        data = request.get_json()
        if not data:
            logger.warning("Missing JSON in login request")
            return jsonify({'error': 'Missing JSON data or invalid credentials format'}), 400

        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            logger.warning("Missing email or password in login")
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            logger.warning(f"Invalid login attempt for email: {email}")
            return jsonify({'error': 'Invalid email or password'}), 401

        access_token = create_access_token(identity={
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role
        })

        logger.info(f"User logged in: {email}")
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }), 200

    except Exception as e:
        logger.error(f"Error during login: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error during login: {str(e)}'}), 500