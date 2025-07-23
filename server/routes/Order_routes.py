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
    user_id = request.user.id  # Injected by auth decorator
    menu_item_id = data.get('menu_item_id')

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

@order_bp.route('/orders/<int:id>/deliver', methods=['PUT'])
@login_required
def mark_as_delivered(id):
    order = Order.query.get_or_404(id)
    order.status = 'Delivered'
    db.session.commit()
    return jsonify({'message': 'Order marked as delivered', 'id': order.id}), 200

@order_bp.route('/orders/summary', methods=['GET'])
@login_required
def order_summary():
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status='Pending').count()
    delivered_orders = Order.query.filter_by(status='Delivered').count()

    return jsonify({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'delivered_orders': delivered_orders
    })

@order_bp.route('/user/orders', methods=['GET'])
@login_required
def get_user_orders():
    try:
        user_id = request.user.id
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()

        return jsonify([
            {
                'id': order.id,
                'menu_item_id': order.menu_item_id,
                'order_date': order.order_date.isoformat(),
                'status': order.status
            }
            for order in orders
        ]), 200

    except Exception as e:
        return jsonify({'message': 'Failed to fetch user orders', 'error': str(e)}), 500
