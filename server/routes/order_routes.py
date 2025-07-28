from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from server.models import db, Order, MealOption, User
import logging

order_bp = Blueprint('orders', __name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@order_bp.route('/', methods=['POST', 'OPTIONS'])
@order_bp.route('', methods=['POST', 'OPTIONS'])  # Handle both /orders and /orders/
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def create_order():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /orders")
        return jsonify({}), 200

    def handle_post():
        try:
            data = request.get_json()
            menu_item_id = data.get('menu_item_id')
            user_id = data.get('user_id')  # Now expecting user_id directly in request body
            logger.debug(f"Creating order for user_id: {user_id}, menu_item_id: {menu_item_id}")

            if not menu_item_id or not user_id:
                logger.warning("Missing menu_item_id or user_id in request")
                return jsonify({"error": "menu_item_id and user_id are required"}), 400

            meal_option = MealOption.query.get(menu_item_id)
            if not meal_option:
                logger.warning(f"Meal option not found: {menu_item_id}")
                return jsonify({"error": "Menu item not found"}), 404

            new_order = Order(menu_item_id=menu_item_id, user_id=user_id, status='pending')
            db.session.add(new_order)
            db.session.commit()
            logger.debug(f"Order created: order_id={new_order.id}")

            return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201
        except Exception as e:
            logger.error(f"Error in create_order: {str(e)}")
            return jsonify({"error": f"Server error: {str(e)}"}), 500

    return handle_post()

@order_bp.route('/user/details', methods=['GET', 'OPTIONS'])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def get_user_order_details():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /orders/user/details")
        return jsonify({}), 200

    def handle_get():
        try:
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({"error": "user_id query parameter is required"}), 400

            logger.debug(f"Fetching orders for user_id: {user_id}")
            orders_menu_items = (
                db.session.query(Order, MealOption)
                .join(MealOption, Order.menu_item_id == MealOption.id, isouter=True)
                .filter(Order.user_id == user_id)
                .all()
            )
            results = [
                {
                    "order_id": order.id,
                    "menu_item": item.name if item else "Unknown Item",
                    "price": item.price if item else 0.0,
                    "status": order.status,
                    "order_date": order.order_date.isoformat() if order.order_date else None
                }
                for order, item in orders_menu_items
            ]
            logger.debug(f"Returning {len(results)} orders: {results}")
            return jsonify(results), 200
        except Exception as e:
            logger.error(f"Error in get_user_order_details: {str(e)}")
            return jsonify({"error": f"Server error: {str(e)}"}), 500

    return handle_get()
