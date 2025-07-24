from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity 
from server.models.user import User
from server.utils.decorators import role_required 
from server.extensions import db, jwt 

auth_bp = Blueprint('auth', __name__) 

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name') 
    
   
    
    if not email or not password or not name: 
        return jsonify({'error': 'Email, password, and name are required'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    

    if email.endswith('@admin.gmail.com'):
        user_role = 'admin'
    else:
        user_role = 'customer'
            
    user = User(email=email, name=name, role=user_role) 
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
   
    access_token = create_access_token(identity={'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role})
    
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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
   
    access_token = create_access_token(identity={'id': user.id, 'email': user.email, 'name': user.name, 'role': user.role})
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role 
        }
    }), 200


@auth_bp.route('/admin/test', methods=['GET'])
@jwt_required() 
@role_required('admin')
def admin_test():
    current_user_identity = get_jwt_identity()
    return jsonify({"msg": f"Welcome, Admin! Your identity: {current_user_identity}"}), 200