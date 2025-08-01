from flask import Blueprint, jsonify, request, make_response
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from server.models.user import User
from server.models.Order import Order
from server.models.Menu_item import MenuItem
from server.extensions import db, bcrypt
from flask_jwt_extended import create_access_token
import logging

user_bp = Blueprint('user_bp', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@user_bp.route('/orders', methods=['GET', 'OPTIONS'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def get_user_orders():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/users/orders")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        user_id = get_jwt_identity()['id']
        user = User.query.get_or_404(user_id)
        orders = Order.query.filter_by(user_id=user_id).all()
        order_list = [{
            'id': order.id,
            'menu_item_id': order.menu_item_id,
            'order_date': order.order_date.isoformat() if order.order_date else None,
            'price': float(order.menu_item.meal_option.price * order.quantity) if order.menu_item and order.menu_item.meal_option else 0,
            'menu_name': order.menu_item.meal_option.name if order.menu_item and order.menu_item.meal_option else 'Unknown',
            'image': order.menu_item.meal_option.image_url if order.menu_item and order.menu_item.meal_option else None,
            'quantity': order.quantity,
            'cart_status': order.cart_status
        } for order in orders]
        logger.info(f"Fetched orders for user: {user_id}")
        return jsonify({'orders': order_list}), 200
    except Exception as e:
        logger.error(f"Error fetching user orders: {str(e)}", exc_info=True)
        return jsonify({'error': f'Failed to fetch orders: {str(e)}'}), 500

@user_bp.route('/admin-dashboard', methods=['GET', 'OPTIONS'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def admin_dashboard():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/users/admin-dashboard")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        user_id = get_jwt_identity()['id']
        user = User.query.get_or_404(user_id)
        if user.role != 'admin':
            logger.warning(f"Unauthorized admin access by user: {user_id}")
            return jsonify({'error': 'Admin access required'}), 403
        logger.info(f"Admin dashboard accessed by user: {user_id}")
        return jsonify({"message": "Welcome to the admin dashboard!"}), 200
    except Exception as e:
        logger.error(f"Error accessing admin dashboard: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@user_bp.route('/register-and-order', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def register_and_order():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/users/register-and-order")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        menu_item_name = data.get('menu_item_name')

        if not all([name, email, password, menu_item_name]):
            logger.warning("Missing required fields in register-and-order")
            return jsonify({"error": "Missing required fields"}), 400

        with db.session.begin():
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                logger.warning(f"Email already registered: {email}")
                return jsonify({"error": "Email already registered"}), 400

            new_user = User(name=name, email=email, role='user')
            new_user.password = bcrypt.generate_password_hash(password).decode('utf-8')
            db.session.add(new_user)
            db.session.flush()

            menu_item = MenuItem.query.filter_by(name=menu_item_name).first()
            if not menu_item:
                logger.warning(f"Menu item not found: {menu_item_name}")
                return jsonify({"error": "Menu item not found"}), 404

            new_order = Order(
                user_id=new_user.id,
                menu_item_id=menu_item.id,
                quantity=1,
                price=menu_item.meal_option.price if menu_item.meal_option else 0,
                cart_status='pending'
            )
            db.session.add(new_order)

        access_token = create_access_token(identity={
            'id': new_user.id,
            'email': new_user.email,
            'name': new_user.name,
            'role': new_user.role
        })
        logger.info(f"User registered and order placed: {email}")
        return jsonify({
            "message": "User registered and order placed successfully",
            "access_token": access_token,
            "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email, "role": new_user.role},
            "order": {
                "id": new_order.id,
                "menu_item_id": new_order.menu_item_id,
                "price": float(new_order.price),
                "quantity": new_order.quantity
            }
        }), 201
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Integrity error in register-and-order: {str(e)}")
        return jsonify({"error": "Email already registered or DB error", "details": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in register-and-order: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500