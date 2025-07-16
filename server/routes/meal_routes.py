from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, MealOption, User

meal_bp = Blueprint('meals', __name__)

@meal_bp.route('/', methods=['GET'])
@jwt_required()

def get_meals():
    meals = MealOption.query.all()
    return jsonify([{
        "id": m.id, "name": m.name, "price": m.price,
         "description": m.description, "caterer_id": m.caterer_id
    } for m in meals]), 200

@meal_bp.route('/', methods=['POST'])
@jwt_required()
def add_meal():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Admin only"}), 403

    data = request.get_json()
    meal = MealOption(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        caterer_id=user.id
    )
    db.session.add(meal)
    db.session.commit()
    return jsonify({"message": "Meal created"}), 201

@meal_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def modify_meal(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    meal = MealOption.query.get_or_404(id)

    if not user or not user.is_admin or meal.caterer_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == 'PUT':
        data = request.get_json()
        meal.name = data.get('name', meal.name)
        meal.description = data.get('description', meal.description)
        meal.price = data.get('price', meal.price)
        db.session.commit()
        return jsonify({"message": "Meal updated"}), 200

    elif request.method == 'DELETE':
        db.session.delete(meal)
        db.session.commit()
        return jsonify({"message": "Meal deleted"}), 200
🔹 3. __init__.py

