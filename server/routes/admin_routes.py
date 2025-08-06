from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models import db, Caterer, Order, MealOption, Menu
from server.services.daraja import get_access_token
from datetime import date, datetime
from sqlalchemy import func
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/order', methods=['GET'])
@jwt_required()
def get_todays_order():
    try:
        caterer_id = get_jwt_identity()
        if not caterer_id:
            logger.warning("Unauthorized access to /admin/order: Missing caterer_id in JWT.")
            return jsonify({"error": "Authentication required: Caterer ID missing"}), 401

        today = date.today()
        logger.debug(f"Fetching today's orders for caterer_id: {caterer_id} on {today}")

        orders = Order.query.filter(
            db.func.date(Order.created_at) == today,
            Order.caterer_id == caterer_id
        ).all()

        return jsonify([order.to_dict() for order in orders]), 200
    except Exception as e:
        logger.error(f"Error fetching today's orders: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching today\'s orders: {str(e)}'}), 500


@admin_bp.route('/revenue', methods=['GET'])
@jwt_required()
def get_total_revenue():
    try:
        caterer_id = get_jwt_identity()
        if not caterer_id:
            logger.warning("Unauthorized access to /admin/revenue: Missing caterer_id in JWT.")
            return jsonify({"error": "Authentication required: Caterer ID missing"}), 401

        logger.debug(f"Fetching total revenue for caterer_id: {caterer_id}")
        today = date.today()


        total_revenue = db.session.query(
            func.sum(MealOption.price * Order.quantity)
        ).join(Order, Order.meal_option_id == MealOption.id
        ).filter(
            db.func.date(Order.created_at) == today,
            Order.caterer_id == caterer_id
        ).scalar() or 0

        return jsonify({
            "date": today.isoformat(),
            "total_revenue": float(total_revenue)
        }), 200
    except Exception as e:
        logger.error(f"Error fetching total revenue: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching revenue: {str(e)}'}), 500


@admin_bp.route('/order_history', methods=['GET'])
@jwt_required()
def get_order_history():
    try:
        caterer_id = get_jwt_identity()
        if not caterer_id:
            logger.warning("Unauthorized access to /admin/order_history: Missing caterer_id in JWT.")
            return jsonify({"error": "Authentication required: Caterer ID missing"}), 401

        logger.debug(f"Fetching order history for caterer_id: {caterer_id}")
        query = Order.query.filter(Order.caterer_id == caterer_id)
        meal_option_id = request.args.get('meal_option_id')
        if meal_option_id:
            query = query.filter(Order.meal_option_id == meal_option_id)

        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        if start_date_str:
            # Convert string to date object for proper comparison
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            query = query.filter(db.func.date(Order.created_at) >= start_date)
        if end_date_str:
            # Convert string to date object for proper comparison
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            query = query.filter(db.func.date(Order.created_at) <= end_date)

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        orders_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        orders = orders_pagination.items

        return jsonify({
            "orders": [order.to_dict() for order in orders],
            "total_pages": orders_pagination.pages,
            "current_page": orders_pagination.page,
            "total_items": orders_pagination.total
        }), 200
    except Exception as e:
        logger.error(f"Error fetching order history: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching order history: {str(e)}'}), 500


@admin_bp.route('/top_meals', methods=['GET'])
@jwt_required()
def top_meals():
    try:
        caterer_id = get_jwt_identity()
        if not caterer_id:
            logger.warning("Unauthorized access to /admin/top_meals: Missing caterer_id in JWT.")
            return jsonify({"error": "Authentication required: Caterer ID missing"}), 401

        logger.debug(f"Fetching top meals for caterer_id: {caterer_id}")
        results = db.session.query(
            MealOption.name,
            func.count(Order.id).label('order_count')
        ).join(
            Order, Order.meal_option_id == MealOption.id
        ).filter(
            MealOption.caterer_id == caterer_id
        ).group_by(
            MealOption.name
        ).order_by(
            func.count(Order.id).desc()
        ).limit(5).all()

        return jsonify([{"meal": r[0], "orders": r[1]} for r in results]), 200
    except Exception as e:
        logger.error(f"Error fetching top meals: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching top meals: {str(e)}'}), 500


@admin_bp.route('/daraja_token', methods=['GET'])
def test_daraja_token():
    try:
        token = get_access_token()
        return jsonify({"access_token": token})
    except Exception as e:
        logger.error(f"Error getting Daraja token: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/simulate_payment', methods=['POST'])
@jwt_required()
def simulate_payment():
    try:
        data = request.get_json()
        phone = data.get("phone_number")
        amount = data.get("amount")

        if not phone or not amount:
            logger.warning("Missing phone number or amount for simulate_payment.")
            return jsonify({"error": "Phone number and amount required"}), 400

        from server.services.daraja import initiate_stk_push
        response = initiate_stk_push(phone, amount)
        logger.info(f"STK Push initiated: {response}")
        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Error simulating payment: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500



@admin_bp.route('/overview', methods=['GET'])
@jwt_required()
def admin_overview():
    try:
        caterer_id = get_jwt_identity()
        if not caterer_id:
            logger.warning("Unauthorized access to /admin/overview: Missing caterer_id in JWT.")
            return jsonify({"error": "Authentication required: Caterer ID missing"}), 401

        logger.debug(f"Fetching admin overview for caterer_id: {caterer_id}")
        today = datetime.now().date()

   
        pending_orders = Order.query.filter_by(status='Pending', caterer_id=caterer_id).count()

        delivered_today_orders = Order.query.filter(
            db.func.date(Order.order_date) == today,
            Order.status == 'Delivered',
            Order.caterer_id == caterer_id
        ).all()

        revenue = sum(order.menu_item.price * order.quantity for order in delivered_today_orders if order.menu_item)


        available_meals = Menu.query.filter_by(is_deleted=False).count() 

        return jsonify({
            'pending_orders': pending_orders,
            'todays_revenue': revenue,
            'available_meals': available_meals
        }), 200
    except Exception as e:
        logger.error(f"Error fetching admin overview: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching admin overview: {str(e)}'}), 500
