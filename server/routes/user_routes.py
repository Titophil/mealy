from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User 
from server.utils.utils import admin_required 

user_bp = Blueprint('user', __name__)

@user_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    orders = [] 
    
    order_list = [{
        'id': order.id,
        'meal_option_id': order.meal_option_id,
        'order_date': order.order_date.isoformat(),
        'price': order.price
    } for order in orders] 
    
    return jsonify({'orders': order_list}), 200

@user_bp.route('/admin-dashboard', methods=['GET'])
@admin_required()
def admin_dashboard():
    return jsonify({"message": "Welcome to the admin dashboard!"}), 200