from flask import Blueprint, request, jsonify
from flask import current_app as app
from datetime import datetime, time
from server.models import Order
from server.extensions import db
from functools import wraps
import jwt

order_bp = Blueprint('orders', __name__)

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            print(f"OPTIONS request for {request.url}")
            return jsonify({}), 200
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] if request.headers['Authorization'].startswith('Bearer ') else None
        if not token:
            print("No token provided")
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            request.user = type('User', (), {'id': data['user_id']})
            print(f"Token valid for user_id: {data['user_id']}")
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return jsonify({'message': 'Invalid token!'}), 401
        return f(*args, **kwargs)
    return decorated

@order_bp.route('/orders', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    user_id = request.user.id
    menu_item_id = data.get('menu_item_id')
    food_name = data.get('food_name')
    amount = data.get('amount')
    phone_number = data.get('phone_number')
    customer_name = data.get('customer_name', 'Anonymous')

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
        food_name=food_name or 'Unknown',
        amount=amount or 0,
        phone_number=phone_number,
        customer_name=customer_name,
        order_date=datetime.now(),
        status='Pending'
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
    order.food_name = data.get('food_name', order.food_name)
    db.session.commit()

    return jsonify({'id': order.id}), 200

@order_bp.route('/orders/current', methods=['GET', 'OPTIONS'])
@login_required
def get_current_order():
    try:
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
            'food_name': order.food_name,
            'amount': float(order.amount) if order.amount else 0,
            'phone_number': order.phone_number,
            'customer_name': order.customer_name,
            'order_date': order.order_date.isoformat(),
            'status': order.status,
            'paid': order.paid,
            'delivered': order.delivered
        })
    except Exception as e:
        print(f"Error fetching current order: {str(e)}")
        return jsonify({"error": "Failed to fetch current order", "details": str(e)}), 500

@order_bp.route('/orders/<int:id>/deliver', methods=['PUT'])
@login_required
def mark_as_delivered(id):
    try:
        order = Order.query.get_or_404(id)
        order.status = 'Delivered'
        order.delivered = True
        db.session.commit()
        return jsonify({'message': 'Order marked as delivered', 'id': order.id}), 200
    except Exception as e:
        print(f"Error marking order as delivered: {str(e)}")
        return jsonify({"error": "Failed to mark order as delivered", "details": str(e)}), 500

@order_bp.route('/orders/summary', methods=['GET'])
@login_required
def order_summary():
    try:
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status='Pending').count()
        delivered_orders = Order.query.filter_by(status='Delivered').count()

        return jsonify({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'delivered_orders': delivered_orders
        })
    except Exception as e:
        print(f"Error fetching order summary: {str(e)}")
        return jsonify({"error": "Failed to fetch order summary", "details": str(e)}), 500

@order_bp.route('/user/orders', methods=['GET', 'OPTIONS'])
@login_required
def get_user_orders():
    try:
        user_id = request.user.id
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()

        return jsonify([
            {
                'id': order.id,
                'menu_item_id': order.menu_item_id,
                'food_name': order.food_name,
                'amount': float(order.amount) if order.amount else 0,
                'phone_number': order.phone_number,
                'customer_name': order.customer_name,
                'order_date': order.order_date.isoformat(),
                'status': order.status,
                'paid': order.paid,
                'delivered': order.delivered
            }
            for order in orders
        ]), 200
    except Exception as e:
        print(f"Error fetching user orders: {str(e)}")
        return jsonify({'message': 'Failed to fetch user orders', 'error': str(e)}), 500

@order_bp.route('/api/orders/details', methods=['GET', 'OPTIONS'])
@login_required
def get_order_details():
    try:
        user_id = request.user.id
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()
        return jsonify([
            {
                'customer_name': order.customer_name,
                'food_name': order.food_name,
                'amount': float(order.amount) if order.amount else 0,
                'phone_number': order.phone_number,
                'paid': order.paid,
                'delivered': order.delivered,
                'created_at': order.order_date.isoformat()
            }
            for order in orders
        ]), 200
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({"error": "Failed to fetch orders", "details": str(e)}), 500