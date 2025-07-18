from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from server.models.user import User, db, bcrypt 

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')
    caterer_id = data.get('caterer_id') 
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(email=email, role=role, caterer_id=caterer_id)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email
        }
    }), 200
