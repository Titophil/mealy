from functools import wraps
from flask import request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from server.models.user import User
import logging

logger = logging.getLogger(__name__)

def login_required(f):
    @wraps(f)
    @cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com"], supports_credentials=True)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()['id']
            user = User.query.get(user_id)
            if not user:
                logger.warning(f"User not found: {user_id}")
                return jsonify({'message': 'User not found'}), 404
            request.user = user
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return jsonify({'message': str(e)}), 401
    return decorated_function

def admin_required():
    def decorator(f):
        @wraps(f)
        @cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com"], supports_credentials=True)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()['id']
                user = User.query.get(user_id)
                if not user or user.role != 'admin':
                    logger.warning(f"Unauthorized admin access by user: {user_id}")
                    return jsonify({'message': 'Admin access required'}), 403
                request.user = user
                return f(*args, **kwargs)
            except Exception as e:
                logger.error(f"Admin authentication error: {str(e)}")
                return jsonify({'message': str(e)}), 401
        return decorated_function
    return decorator