from flask import Blueprint, request, jsonify
from server.models import db, MealOption
from flask_jwt_extended import jwt_required, get_jwt_identity
import functools
import requests
import string

meal_bp = Blueprint('meals', __name__)

# -------------------- Auth Utility -------------------- #
def caterer_required(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        return fn(*args, **kwargs)
    return wrapper

# -------------------- Internal CRUD APIs -------------------- #
@meal_bp.route('/meals', methods=['GET'])
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
        description=data.get('description', ''),
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

# -------------------- External API Fetch -------------------- #
@meal_bp.route('/meals/external', methods=['GET'])
def get_external_meals():
    meals = []
    for letter in string.ascii_lowercase:
        try:
            res = requests.get(f"https://www.themealdb.com/api/json/v1/1/search.php?f={letter}")
            if res.status_code == 200 and res.json().get('meals'):
                meals.extend(res.json()['meals'])
        except Exception as e:
            print(f"Error fetching meals for {letter}: {e}")
            continue

    # ✅ Use frontend-expected keys
    simplified_meals = [{
        "idMeal": meal['idMeal'],
        "strMeal": meal['strMeal'],
        "strMealThumb": meal['strMealThumb'],
        "strCategory": meal['strCategory'],
        "strArea": meal['strArea']
    } for meal in meals if meal]

    return jsonify(simplified_meals), 200

# -------------------- Optional Search Endpoint -------------------- #
@meal_bp.route('/meals/external/search', methods=['GET'])
def search_external_meals():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query param 'q' is required"}), 400

    url = f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}"
    try:
        res = requests.get(url)
        res.raise_for_status()
        data = res.json().get("meals", [])
        return jsonify([{
            "idMeal": m['idMeal'],
            "strMeal": m['strMeal'],
            "strMealThumb": m['strMealThumb'],
            "strCategory": m['strCategory'],
            "strArea": m['strArea']
        } for m in data if m]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
