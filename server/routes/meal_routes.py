from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from server.models.MealOption import MealOption
from .extensions import db

meal_routes = Blueprint("meal_bp", __name__)

# CORS whitelist
allowed_origins = [
    "http://localhost:5173",
    "https://mealy-8-1cv8.onrender.com",
    "https://mealy-12-fnkh.onrender.com"
]

@meal_routes.route("/api/meals", methods=["POST"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def create_meal():
    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        price = data.get("price")

        if not all([name, description, price]):
            return jsonify({"error": "Missing meal fields"}), 400

        new_meal = Meal(name=name, description=description, price=price)
        db.session.add(new_meal)
        db.session.commit()

        return jsonify({"message": "Meal created successfully", "meal": new_meal.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@meal_routes.route("/api/meals", methods=["GET"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def get_meals():
    try:
        meals = Meal.query.all()
        meal_list = [meal.to_dict() for meal in meals]
        return jsonify(meal_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
