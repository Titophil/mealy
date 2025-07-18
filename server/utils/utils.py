from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models.user import User 

def admin_required():
    """
    Decorator to restrict access to routes to only users with the 'admin' role.
    Requires a valid JWT token.
    """
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id) 
            
            if claims.get('role') == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify({"msg": "Admin access required"}), 403
        return decorator
    return wrapper