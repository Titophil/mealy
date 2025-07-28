from flask import Blueprint, request, jsonify
from server.models.user import User
from server.models.caterer import Caterer
from server.extensions import db, bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Missing JSON in request'}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    name = data.get('name', '').strip()
    phone = data.get('phone', '').strip()  # Optional, for Caterer

    if not email or not password or not name:
        return jsonify({'error': 'Email, password, and name are required'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        if not existing_user.role:
            db.session.delete(existing_user)
            db.session.commit()
        else:
            return jsonify({'error': 'Email already exists'}), 400

    role = 'admin' if email.endswith('@admin.gmail.com') else 'customer'

    try:
        user = User(email=email, name=name, role=role)
        user.password = password  # Using the property setter

        db.session.add(user)
        db.session.flush()  # Get the user.id before commit

        if role == 'admin':
            caterer = Caterer(id=user.id, name=user.name, email=user.email, phone=phone or '', password=password)
            db.session.add(caterer)

        db.session.commit()

        access_token = create_access_token(identity={
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role
        })

        return jsonify({
            'message': 'User created successfully',
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
        return jsonify({'error': f'Server error during signup: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.authenticate(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'role': user.role,
        'user_id': user.id
    }), 200