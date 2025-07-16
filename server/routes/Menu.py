from app import db
from flask import Blueprint,request,jsonify
from models import Menu,MenuItem
from datetime import datetime


menu_bp = Blueprint('menu_bp', __name__)


@menu_bp.route('/menus', methods=['POST'])
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

        
