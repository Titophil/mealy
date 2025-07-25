from flask import Blueprint, request, jsonify
from server.models.Menu import Menu
from server.models.Menu_item import MenuItem
from server.models.MealOption import MealOption
from server.extensions import db
from datetime import datetime

menu_bp = Blueprint('menu_bp', __name__)  # ✅ corrected `name` to `__name__`

@menu_bp.route('/today', methods=['GET'])
def get_today_menu():
    today = datetime.utcnow().date()
    menu = Menu.query.filter(db.func.date(Menu.menu_date) == today).first()
    if not menu:
        return jsonify({"message": "No menu found for today"}), 404
    return jsonify({
        "id": menu.id,
        "menu_date": menu.menu_date.isoformat(),
        "items": [item.to_dict() for item in menu.items]
    }), 200

@menu_bp.route('', methods=['POST'])
def create_menu():
    data = request.get_json()
    menu_date = data.get('menu_date')
    items = data.get('items', [])

    if not menu_date:
        return jsonify({"error": "Menu date is required"}), 400

    try:
        menu_date = datetime.strptime(menu_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    menu = Menu(name=f"Menu for {menu_date}", menu_date=menu_date)
    db.session.add(menu)
    db.session.commit()

    for item_name in items:
        meal = MealOption.query.filter_by(name=item_name).first()
        if meal:
            menu_item = MenuItem(name=item_name, menu_id=menu.id, meal_option_id=meal.id)
            db.session.add(menu_item)

    db.session.commit()
    return jsonify({"message": "Menu created successfully", "id": menu.id}), 201

@menu_bp.route('/<int:menu_id>/update', methods=['PUT'])
def update_menu_item_status(menu_id):
    data = request.get_json()
    items = data.get('items', [])
    menu = Menu.query.get_or_404(menu_id)

    for item_data in items:
        menu_item = MenuItem.query.filter_by(menu_id=menu_id, name=item_data['name']).first()
        if menu_item:
            # Update fields if necessary
            pass

    db.session.commit()
    return jsonify({"message": "Menu updated successfully"}), 200
