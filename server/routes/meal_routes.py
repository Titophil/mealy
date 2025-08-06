from flask import Blueprint, request, jsonify
from server.models.user import User
from server.models.MealOption import MealOption
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import functools
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

meal_bp = Blueprint('meals', __name__)

def caterer_required(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'caterer': 
            logger.warning(f"Unauthorized access: Caterer access required for user {user_id}")
            return jsonify({"error": "Caterer access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@meal_bp.route('/', methods=['GET'])
def get_meals():
    try:
        meals = MealOption.query.all()
        logger.debug(f"Fetched {len(meals)} meals.")
        return jsonify([{
            "id": m.id,
            "name": m.name,
            "description": m.description,
            "price": float(m.price), 
            "image": m.image,
            "caterer_id": m.caterer_id
        } for m in meals]), 200
    except Exception as e:
        logger.error(f"Error fetching meals: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error fetching meals: {str(e)}'}), 500

@meal_bp.route('', methods=['POST']) 
@jwt_required()
@caterer_required
def create_meal():
    try:
        data = request.get_json()
        if not data:
            logger.warning("Missing JSON data for meal creation.")
            return jsonify({'error': 'Missing JSON data'}), 400

        name = data.get('name')
        description = data.get('description', '')
        price = data.get('price')
        image = data.get('image', '')
        caterer_id = get_jwt_identity() 

        if not name or price is None:
            logger.warning("Missing name or price for meal creation.")
            return jsonify({'error': 'Name and price are required'}), 400

        meal = MealOption(
            name=name,
            description=description,
            price=price,
            image=image,
            caterer_id=caterer_id
        )
        db.session.add(meal)
        db.session.commit()
        logger.info(f"Meal created: {meal.name} by caterer {caterer_id}")
        return jsonify(message="Meal created", id=meal.id), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating meal: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error creating meal: {str(e)}"}), 500

@meal_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
@caterer_required
def update_or_delete_meal(id):
    try:
        meal = MealOption.query.get_or_404(id)
        current_caterer_id = get_jwt_identity()

        if meal.caterer_id != current_caterer_id:
            logger.warning(f"Unauthorized attempt to modify meal {id} by caterer {current_caterer_id}.")
            return jsonify(error="Not allowed to modify this meal"), 403

        if request.method == 'PUT':
            data = request.get_json()
            meal.name = data.get('name', meal.name)
            meal.description = data.get('description', meal.description)
            meal.price = data.get('price', meal.price)
            meal.image = data.get('image', meal.image)
            db.session.commit()
            logger.info(f"Meal {id} updated.")
            return jsonify(message="Meal updated"), 200

        elif request.method == 'DELETE':
            db.session.delete(meal)
            db.session.commit()
            logger.info(f"Meal {id} deleted.")
            return jsonify(message="Meal deleted"), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating/deleting meal {id}: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500
