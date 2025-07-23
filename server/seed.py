from server.extensions import db
from server.models import Caterer, MealOption, Menu, MenuItem
from flask import Flask
from datetime import date
from server.app import app


with app.app_context():
    print("📦 Seeding the database...")
    db.drop_all()
    db.create_all()

    # Create sample caterer
    caterer = Caterer(name="Sample Caterer", email="caterer@example.com", phone="0712345678")
    caterer.password = "password123"
    db.session.add(caterer)
    db.session.commit()
    print("✅ Caterer added.")

    # Create meal options
    meals = [
        MealOption(name="Beef Stew", description="Slow cooked beef with vegetables", price=300, caterer_id=caterer.id),
        MealOption(name="Fried Chicken", description="Crispy chicken with fries", price=250, caterer_id=caterer.id),
        MealOption(name="Vegetable Pilau", description="Spiced rice with mixed veggies", price=200, caterer_id=caterer.id),
        MealOption(name="Chapati & Beans", description="Kenyan chapati with tasty beans", price=180, caterer_id=caterer.id),
    ]
    db.session.add_all(meals)
    db.session.commit()
    print("✅ Meal options added.")

    # Create today's menu if not exists
    # Create today's menu if not exists
    today = date.today()
    if not Menu.query.filter_by(menu_date=today).first():
        menu = Menu(menu_date=today, caterer_id=caterer.id)
        db.session.add(menu)
        db.session.flush()

        for m in meals[:3]:  # Add first 3 meals
            item = MenuItem(name=m.name, menu=menu)
            db.session.add(item)

        db.session.commit()
        print("✅ Sample menu created for today.")
    else:
        print("⚠️ Menu already exists for today.")
