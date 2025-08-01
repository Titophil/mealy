from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from server.models.MealOption import MealOption
from server.models.caterer import Caterer
from server.extensions import db, bcrypt
import logging

meal_bp = Blueprint('meal_bp', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@meal_bp.route('', methods=['GET', 'OPTIONS'])
@meal_bp.route('/', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def fetch_meals():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/meals")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        meals = MealOption.query.all()
        meal_list = [{
            'id': meal.id,
            'name': meal.name,
            'description': meal.description,
            'price': float(meal.price),
            'image': meal.image_url,
            'caterer_id': meal.caterer_id
        } for meal in meals]
        logger.info("Fetched all meals")
        return jsonify({'meals': meal_list}), 200
    except Exception as e:
        logger.error(f"Error fetching meals: {str(e)}", exc_info=True)
        return jsonify({'error': f'Failed to fetch meals: {str(e)}'}), 500

@meal_bp.route('', methods=['POST', 'OPTIONS'])
@meal_bp.route('/', methods=['POST', 'OPTIONS'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def create_meal():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /api/meals (POST)")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        data = request.get_json()
        if not data or 'name' not in data or 'price' not in data:
            logger.warning("Missing name or price in create meal request")
            return jsonify({'error': 'Name and price are required'}), 400

        caterer_id = data.get('caterer_id', 1)
        caterer = Caterer.query.get(caterer_id)
        if not caterer:
            logger.warning(f"Caterer not found: {caterer_id}, creating default")
            try:
                caterer = Caterer(
                    id=caterer_id,
                    name=f"Caterer_{caterer_id}",
                    email=f"caterer_{caterer_id}@example.com",
                    phone=f"+254700000{caterer_id}",
                    password=bcrypt.generate_password_hash("default_password").decode('utf-8')
                )
                db.session.add(caterer)
                db.session.flush()
                logger.info(f"Created caterer {caterer_id} automatically")
            except Exception as e:
                db.session.rollback()
                logger.error(f"Failed to create caterer: {str(e)}")
                return jsonify({'error': f'Failed to create caterer: {str(e)}'}), 500

        meal = MealOption(
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price']),
            image_url=data.get('image', ''),
            caterer_id=caterer_id
        )
        db.session.add(meal)
        db.session.commit()
        logger.info(f"Created meal {meal.id} for caterer {caterer_id}")
        return jsonify({
            'id': meal.id,
            'name': meal.name,
            'description': meal.description,
            'price': float(meal.price),
            'image': meal.image_url,
            'caterer_id': meal.caterer_id
        }), 201
    except ValueError as ve:
        db.session.rollback()
        logger.error(f"Invalid price value: {str(ve)}")
        return jsonify({'error': f'Invalid price value: {str(ve)}'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating meal: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@meal_bp.route('/<int:id>', methods=['PUT', 'DELETE', 'OPTIONS'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def update_or_delete_meal(id):
    if request.method == 'OPTIONS':
        logger.debug(f"Handling OPTIONS request for /api/meals/{id}")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    try:
        meal = MealOption.query.get_or_404(id)
        if request.method == 'PUT':
            data = request.get_json()
            if not data or 'name' not in data or 'price' not in data:
                logger.warning("Missing name or price in update meal request")
                return jsonify({'error': 'Name and price are required'}), 400
            meal.name = data.get('name', meal.name)
            meal.description = data.get('description', meal.description)
            meal.price = float(data.get('price', meal.price))
            meal.image_url = data.get('image', meal.image_url)
            meal.caterer_id = data.get('caterer_id', meal.caterer_id)
            db.session.commit()
            logger.info(f"Updated meal {meal.id}")
            return jsonify({
                'id': meal.id,
                'name': meal.name,
                'description': meal.description,
                'price': float(meal.price),
                'image': meal.image_url,
                'caterer_id': meal.caterer_id
            }), 200
        elif request.method == 'DELETE':
            db.session.delete(meal)
            db.session.commit()
            logger.info(f"Deleted meal {id}")
            return jsonify({'message': 'Meal deleted'}), 200
    except ValueError as ve:
        db.session.rollback()
        logger.error(f"Invalid price value: {str(ve)}")
        return jsonify({'error': f'Invalid price value: {str(ve)}'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error processing meal {id}: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@meal_bp.route('/../../meals/', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "https://mealy-17.onrender.com", "https://sweet-tuzt.onrender.com"], supports_credentials=True)
def meals_fallback():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request for /meals/ fallback")
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response, 200
    logger.warning("Incorrect endpoint /meals/ called, redirecting to /api/meals")
    return fetch_meals()