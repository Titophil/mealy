
from flask import Blueprint, request, jsonify
from server.models.user import User
from server.models.MealOption import MealOption
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import functools

meal_bp = Blueprint('meals', __name__)

def caterer_required(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'caterer':
            return jsonify({"error": "Caterer access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@meal_bp.route('/', methods=['GET'])
def get_meals():
    meals = MealOption.query.all()
    return jsonify([{
        "id": m.id,
        "name": m.name,
        "description": m.description,
        "price": m.price,
        "image": m.image,
        "caterer_id": m.caterer_id
    } for m in meals]), 200

@meal_bp.route('', methods=['POST'])
@jwt_required()
@caterer_required
def create_meal():
    data = request.get_json()
    meal = MealOption(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        image=data.get('image', ''),
        caterer_id=get_jwt_identity()
    )
    db.session.add(meal)
    db.session.commit()
    return jsonify(message="Meal created", id=meal.id), 201

@meal_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
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
        meal.image = data.get('image', meal.image)
        db.session.commit()
        return jsonify(message="Meal updated"), 200

    elif request.method == 'DELETE':
        db.session.delete(meal)
        db.session.commit()
        return jsonify(message="Meal deleted"), 200
