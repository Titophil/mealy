from flask import Blueprint, jsonify, request 
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Caterer, Order, MealOption, Menu
from services.daraja import get_access_token
from datetime import date
from sqlalchemy import func

admin_bp = Blueprint('admin_bp', __name__)


@admin_bp.route('/order', methods=['GET'])
@jwt_required()
def get_todays_order():
    caterer_id = get_jwt_identity()
    today = date.today()

    orders = Order.query.filter(
        db.func.date(Order.created_at) == today,
        Order.caterer_id == caterer_id
    ).all()

    return jsonify([order.to_dict() for order in orders]), 200


@admin_bp.route('/revenue', methods=['GET'])
@jwt_required()
def get_total_revenue():
    caterer_id = get_jwt_identity()
    today = date.today()

    total_revenue = db.session.query(
        func.sum(MealOption.price)
    ).join(MealOption, Order.meal_option_id == MealOption.id
    ).filter(
        db.func.date(Order.created_at) == today,
        Order.caterer_id == caterer_id
    ).scalar() or 0

    return jsonify({
        "date": today.isoformat(),
        "total_revenue": float(total_revenue)
    }), 200


@admin_bp.route('/order_history', methods=['GET']) 
@jwt_required()
def get_order_history():
    caterer_id = get_jwt_identity()

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = Order.query.filter(Order.caterer_id == caterer_id)
    meal_option_id = request.args.get('meal_option_id')
    if meal_option_id:
       query = query.filter(Order.meal_option_id == meal_option_id)

    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    orders = query.paginate(page=page, per_page=per_page, error_out=False).items

    return jsonify([order.to_dict() for order in orders]), 200


@admin_bp.route('/top_meals', methods=['GET'])
@jwt_required()
def top_meals():
    caterer_id = get_jwt_identity()
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


@admin_bp.route('/daraja_token', methods=['GET'])
def test_daraja_token():
    try:
        token = get_access_token()
        return jsonify({"access_token": token})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
