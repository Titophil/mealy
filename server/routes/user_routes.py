from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from server.models.user import User 
from server.models.Order import Order
from server.models.Menu_item import MenuItem# assuming menu item model exists
from server.extensions import db
from server.utils.utils import admin_required 

user_bp = Blueprint('user', __name__)

@user_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    orders = Order.query.filter_by(user_id=user_id).all()

    order_list = [{
        'id': order.id,
        'meal_option_id': order.meal_option_id,
        'order_date': order.order_date.isoformat() if order.order_date else None,
        'price': order.price
    } for order in orders]

    return jsonify({'orders': order_list}), 200

@user_bp.route('/admin-dashboard', methods=['GET'])
@admin_required()
def admin_dashboard():
    return jsonify({"message": "Welcome to the admin dashboard!"}), 200


# ✅ New route: Register and Order
@user_bp.route('/register-and-order', methods=['POST'])
def register_and_order():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    menu_item_name = data.get('menu_item_name')

    if not all([name, email, password, menu_item_name]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        with db.session.begin():
            # Step 1: Register user
            new_user = User(name=name, email=email)
            new_user.set_password(password)  # assuming your model has set_password()
            db.session.add(new_user)
            db.session.flush()  # new_user.id now available

            # Step 2: Fetch menu item
            menu_item = MenuItem.query.filter_by(name=menu_item_name).first()
            if not menu_item:
                return jsonify({"error": "Menu item not found"}), 404

            # Step 3: Create order
            new_order = Order(
                user_id=new_user.id,
                meal_option_id=menu_item.id,
                price=menu_item.price  # assuming `price` exists
            )
            db.session.add(new_order)

        return jsonify({
            "message": "User registered and order placed successfully",
            "user": {"id": new_user.id, "name": new_user.name},
            "order": {
                "id": new_order.id,
                "meal_option_id": new_order.meal_option_id,
                "price": new_order.price
            }
        }), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Email already registered or DB error", "details": str(e)}), 400
