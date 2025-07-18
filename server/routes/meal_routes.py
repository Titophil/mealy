from flask import Blueprint, request, jsonify
from server.models import db, MealOption
from flask_jwt_extended import jwt_required, get_jwt_identity

meal_bp = Blueprint('meals', __name__)

import functools

def caterer_required(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        return fn(*args, **kwargs)
    return wrapper

@meal_bp.route('/meals', methods=['GET'])
@jwt_required()
def get_meals():
    meals = MealOption.query.all()
    return jsonify([{
        "id": m.id,
        "name": m.name,
        "description": m.description,
        "price": m.price,
        "caterer_id": m.caterer_id
    } for m in meals]), 200

@meal_bp.route('/meals', methods=['POST'])
@jwt_required()
@caterer_required
def create_meal():
    data = request.get_json()
    meal = MealOption(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        caterer_id=get_jwt_identity() 
    )
    db.session.add(meal)
    db.session.commit()
    return jsonify(message="Meal created", id=meal.id), 201

@meal_bp.route('/meals/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
@caterer_required
def update_or_delete_meal(id):
    meal = MealOption.query.get_or_404(id)

    if meal.caterer_id != get_jwt_identity():
        return jsonify(error="Not allowed"), 403

    if request.method == 'PUT':
        data = request.get_json()
        meal.name = data.get('name', meal.name)
        meal.description = data.get('description', meal.description)
        meal.price = data.get('price', meal.price)
        db.session.commit()
        return jsonify(message="Meal updated"), 200

    elif request.method == 'DELETE':
        db.session.delete(meal)
        db.session.commit()
        return jsonify(message="Meal deleted"), 200
