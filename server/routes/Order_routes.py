from flask import Blueprint, request, jsonify
from datetime import datetime, time
from server.models.Order import Order
from server.extensions import db
from auth import login_required

order_bp = Blueprint('orders', __name__)

@order_bp.route('/orders', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    user_id = request.user.id  # Assuming auth middleware adds user to request
    menu_item_id = data.get('menu_item_id')

    # Check for existing order today
    today = datetime.now().date()
    existing_order = Order.query.filter(
        Order.user_id == user_id,
        db.func.date(Order.order_date) == today
    ).first()

    if existing_order:
        return jsonify({'message': 'User already has an order for today'}), 400

    order = Order(
        user_id=user_id,
        menu_item_id=menu_item_id,
        order_date=datetime.now()
    )
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({'id': order.id}), 201

@order_bp.route('/orders/<int:id>', methods=['PUT'])
@login_required
def update_order(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    
    # Check if after cutoff time (10 AM)
    cutoff_time = time(10, 0)
    current_time = datetime.now().time()
    
    if current_time > cutoff_time:
        return jsonify({'message': 'Cannot modify order after cutoff time'}), 400
    
    order.menu_item_id = data.get('menu_item_id', order.menu_item_id)
    db.session.commit()
    
    return jsonify({'id': order.id}), 200

@order_bp.route('/orders/current', methods=['GET'])
@login_required
def get_current_order():
    today = datetime.now().date()
    order = Order.query.filter(
        Order.user_id == request.user.id,
        db.func.date(Order.order_date) == today
    ).first()
    
    if not order:
        return jsonify({'message': 'No order found for today'}), 404
        
    return jsonify({
        'id': order.id,
        'menu_item_id': order.menu_item_id,
        'order_date': order.order_date
    })
