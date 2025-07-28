from flask import Blueprint, request, jsonify
from server.models.Menu import Menu
from server.models.MenuItem import MenuItem
from server.models.MealOption import MealOption
from server.extensions import db
from datetime import datetime
import logging
import pytz

menu_bp = Blueprint('menu_bp', __name__)

@menu_bp.route('', methods=['GET'])
def get_all_menus():
    menus = Menu.query.all()
    logging.info(f"Fetched menus: {[m.id for m in menus]}")
    return jsonify([
        {
            "id": menu.id,
            "menu_date": menu.menu_date.isoformat(),
            "items": [item.meal_option.to_dict() for item in menu.items if item.meal_option]
        } for menu in menus
    ]), 200

@menu_bp.route('/today', methods=['GET'])
def get_today_menu():
    eat = pytz.timezone('Africa/Nairobi')
    today = datetime.now(eat).date()
    menus = Menu.query.filter(db.func.date(Menu.menu_date) == today).all()
    if not menus:
        return jsonify({"message": "No menu found for today"}), 404
    return jsonify([
        {
            "id": menu.id,
            "menu_date": menu.menu_date.isoformat(),
            "items": [item.meal_option.to_dict() for item in menu.items if item.meal_option]
        } for menu in menus
    ]), 200

@menu_bp.route('/<string:date_str>', methods=['GET'])
def get_menu_by_date(date_str):
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    menus = Menu.query.filter(db.func.date(Menu.menu_date) == query_date).all()
    if not menus:
        return jsonify({"message": "No menu found"}), 404
    return jsonify([
        {
            "id": menu.id,
            "menu_date": menu.menu_date.isoformat(),
            "items": [item.meal_option.to_dict() for item in menu.items if item.meal_option]
        } for menu in menus
    ]), 200

@menu_bp.route('', methods=['POST'])
def create_menu():
    data = request.get_json()
    menu_date = data.get('menu_date')
    items = data.get('items', [])

    if not menu_date:
        return jsonify({"error": "Menu date is required"}), 400

    try:
        menu_date = datetime.strptime(menu_date, '%Y-%m-%d').date()
        eat = pytz.timezone('Africa/Nairobi')
        now = datetime.now(eat)

        menu = Menu(
            name=f"Menu for {menu_date} - {now.strftime('%H:%M:%S')}",
            menu_date=now  # Storing datetime with time to allow multiple per day
        )
        db.session.add(menu)
        db.session.flush()

        if not items:
            logging.warning(f"No items provided for menu creation on {menu_date}")
        else:
            for item_name in items:
                meal = MealOption.query.filter_by(name=item_name).first()
                if meal:
                    menu_item = MenuItem(name=item_name, menu_id=menu.id, meal_option_id=meal.id)
                    db.session.add(menu_item)
                    logging.info(f"Added item {item_name} to menu {menu.id}")
                else:
                    logging.warning(f"Meal {item_name} not found for menu {menu.id}")

        db.session.commit()
        logging.info(f"Created menu {menu.id} for {menu_date}")
        return jsonify({"message": "Menu created successfully", "id": menu.id}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating menu: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@menu_bp.route('/<int:menu_id>/add-items', methods=['POST'])
def add_items_to_menu(menu_id):
    data = request.get_json()
    items = data.get('items', [])
    menu = Menu.query.get_or_404(menu_id)

    existing_items = {item.meal_option.name for item in menu.items if item.meal_option}
    for item_name in items:
        if item_name not in existing_items:
            meal = MealOption.query.filter_by(name=item_name).first()
            if meal:
                menu_item = MenuItem(name=item_name, menu_id=menu.id, meal_option_id=meal.id)
                db.session.add(menu_item)
                logging.info(f"Added item {item_name} to menu {menu_id}")
            else:
                logging.warning(f"Meal {item_name} not found for menu {menu_id}")
        else:
            logging.info(f"Item {item_name} already exists in menu {menu_id}")

    db.session.commit()
    return jsonify({"message": "Items added to menu successfully"}), 200

@menu_bp.route('/<int:menu_id>/update', methods=['PUT'])
def update_menu_item_status(menu_id):
    data = request.get_json()
    items = data.get('items', [])
    menu = Menu.query.get_or_404(menu_id)

    for item_data in items:
        menu_item = MenuItem.query.filter_by(menu_id=menu_id, name=item_data.get('name')).first()
        if menu_item:
            if 'status' in item_data:
                menu_item.status = item_data['status']

    db.session.commit()
    return jsonify({"message": "Menu updated successfully"}), 200
