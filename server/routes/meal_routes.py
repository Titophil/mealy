from flask import Blueprint, request, jsonify
from server.models.user import User
from server.models.MealOption import MealOption
from server.models.caterer import Caterer
from server.extensions import db
import logging

meal_bp = Blueprint('meals', __name__)

@meal_bp.route('/', methods=['GET'])
def get_meals():
    meals = MealOption.query.all()
    return jsonify([
        {
            "id": m.id,
            "name": m.name,
            "description": m.description,
            "price": m.price,
            "image": m.image,
            "caterer_id": m.caterer_id
        } for m in meals
    ]), 200

@meal_bp.route('', methods=['POST'])
def create_meal():
    data = request.get_json()
    if not data or 'name' not in data or 'price' not in data:
        return jsonify({"error": "Name and price are required"}), 400
    caterer_id = 1  # Default caterer_id; adjust as needed
    caterer = Caterer.query.get(caterer_id)
    if not caterer:
        try:
            caterer = Caterer(
                id=caterer_id,
                name=f"Caterer_{caterer_id}",
                email=f"caterer_{caterer_id}@example.com",
                phone=f"+254700000{caterer_id}",
                password_hash=bcrypt.generate_password_hash("default_password").decode('utf-8')
            )
            db.session.add(caterer)
            db.session.flush()
            logging.info(f"Created caterer {caterer_id} automatically")
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Failed to create caterer: {str(e)}"}), 500

    try:
        meal = MealOption(
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price']),
            image=data.get('image', ''),
            caterer_id=caterer_id
        )
        db.session.add(meal)
        db.session.commit()
        logging.info(f"Created meal {meal.id} for caterer {caterer_id}")
        return jsonify({
            "id": meal.id,
            "name": meal.name,
            "description": meal.description,
            "price": meal.price,
            "image": meal.image,
            "caterer_id": meal.caterer_id
        }), 201
    except ValueError as ve:
        db.session.rollback()
        return jsonify({"error": f"Invalid price value: {str(ve)}"}), 400
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating meal: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@meal_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
def update_or_delete_meal(id):
    meal = MealOption.query.get(id)
    if not meal:
        return jsonify({"error": "Meal not found"}), 404

    if request.method == 'PUT':
        data = request.get_json()
        if not data or 'name' not in data or 'price' not in data:
            return jsonify({"error": "Name and price are required"}), 400
        try:
            meal.name = data.get('name', meal.name)
            meal.description = data.get('description', meal.description)
            meal.price = float(data.get('price', meal.price))
            meal.image = data.get('image', meal.image)
            db.session.commit()
            logging.info(f"Updated meal {meal.id}")
            return jsonify({
                "id": meal.id,
                "name": meal.name,
                "description": meal.description,
                "price": meal.price,
                "image": meal.image,
                "caterer_id": meal.caterer_id
            }), 200
        except ValueError as ve:
            db.session.rollback()
            return jsonify({"error": f"Invalid price value: {str(ve)}"}), 400
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating meal {id}: {str(e)}")
            return jsonify({"error": f"Server error: {str(e)}"}), 500
    elif request.method == 'DELETE':
        try:
            db.session.delete(meal)
            db.session.commit()
            logging.info(f"Deleted meal {id}")
            return jsonify({"message": "Meal deleted"}), 200
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting meal {id}: {str(e)}")
            return jsonify({"error": f"Server error: {str(e)}"}), 500