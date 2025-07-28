from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from .models.user import User  # Adjust if your user model is elsewhere

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 404

            request.user = user  # attach user object to request
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': str(e)}), 401
    return decorated_function
