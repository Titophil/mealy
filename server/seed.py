# seed.py
from server.extensions import db
from server.models import MealOption, Menu, MenuItem
from flask import Flask
from datetime import date

# Import create_app if you're using application factory
from server.app import app

with app.app_context():
    print("📦 Seeding the database...")

    # Drop all and recreate
    db.drop_all()
    db.create_all()

    # Create meal options
    meals = [
        MealOption(name="Beef Stew", description="Slow cooked beef with vegetables", price=300, caterer_id=1),
        MealOption(name="Fried Chicken", description="Crispy chicken with fries", price=250, caterer_id=1),
        MealOption(name="Vegetable Pilau", description="Spiced rice with mixed veggies", price=200, caterer_id=1),
        MealOption(name="Chapati & Beans", description="Kenyan chapati with tasty beans", price=180, caterer_id=1),
    ]

    db.session.add_all(meals)
    db.session.commit()
    print("✅ Meal options added.")

    # Optional: Create a menu for today
    today = date.today()
    if not Menu.query.filter_by(menu_date=today).first():
        menu = Menu(menu_date=today)
        db.session.add(menu)
        db.session.flush()

        # Link meals to menu
        for m in meals[:3]:  # Pick first 3 meals for today's menu
            item = MenuItem(name=m.name, menu=menu)
            db.session.add(item)

        db.session.commit()
        print("✅ Sample menu created for today.")
    else:
        print("⚠️ Menu already exists for today.")
