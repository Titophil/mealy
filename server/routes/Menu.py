from extensions import db
from flask import Blueprint,request,jsonify
from models.Menu import Menu
from models.Menu_item import MenuItem
from datetime import datetime


menu_bp = Blueprint('menu_bp', __name__)


@menu_bp.route('', methods=['POST'])
def create_menu():
    data = request.get_json()

    try:
        date_str = data.get('menu_date')
        menu_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        items = data.get('items', [])


        if Menu.query.filter_by(menu_date=menu_date).first():
            return jsonify({"error": "Menu for this date already exists"}), 400
        

        new_menu = Menu(menu_date=menu_date)
        db.session.add(new_menu)
        db.session.flush()


        for item_name in items:
            item = MenuItem(name=item_name, menu=new_menu)
            db.session.add(item)

        db.session.commit()


        return jsonify({
            "id": new_menu.id,
            "menu_date": new_menu.menu_date.isoformat(),
            "items": [item.name for item in new_menu.items]
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500   




@menu_bp.route('', methods=['GET'])
def get_all_menus():
    try:
        menus = Menu.query.all()
        return jsonify([
            {
                "id": menu.id,
                "menu_date": menu.menu_date.isoformat(),
                "items": [item.name for item in menu.items]
            }
            for menu in menus
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@menu_bp.route('/<string:menu_date>',methods=['GET'])
def get_menu_bt_date(menu_date):
    try:
        date_obj= datetime.strptime(menu_date,'%Y-%m-%d').date()
        menu=Menu.query.filter_by(menu_date=date_obj).first()

        if not menu :
            return  jsonify({"error": "No menu found for this date"}), 404
        

        return jsonify({
            "id": menu.id,
            "menu_date": menu.menu_date.isoformat(),
            "items": [item.name for item in menu.items]
        })
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
