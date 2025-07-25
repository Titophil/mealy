from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request() 
            claims = get_jwt_identity() 

            if claims and claims.get('role') == required_role:
                return fn(*args, **kwargs)
            else:
                return jsonify({"msg": "Unauthorized: Admin access required"}), 403 # Changed message slightly
        return wrapper
    return decorator