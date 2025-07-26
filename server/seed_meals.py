import sys
import os
import random
from flask import Flask

# Ensure parent directory is in Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from server.extensions import db
from server.models.caterer import Caterer
from server.models.Menu import Menu
from server.models.Menu_item import MenuItem
from server.models.Order import Order
from server.models.MealOption import MealOption
from server.config import Config

# Flask app setup
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Meal seed data
meal_names = [
    "Grilled Chicken Pasta", "Sushi Platter", "Beef Steak", "Green Curry Chicken",
    "Cheese Pizza", "Spaghetti Bolognese", "Vietnamese Pho", "Hyderabadi Biryani",
    "Veggie Wrap", "Paneer Butter Masala", "Chicken Shawarma", "Roast Turkey",
    "Fish and Chips", "Classic Burger", "Chicken Tikka", "Lasagna",
    "Teriyaki Salmon", "Prawn Tempura", "French Toast", "Greek Salad",
    "Caesar Salad", "Tandoori Chicken", "Mixed Grill Platter"
]

image_files = [
    "penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table.jpg",
    "pexels-catscoming-674574.jpg", "pexels-chevanon-323682.jpg",
    "pexels-chokniti-khongchum-1197604-2280545.jpg", "pexels-enginakyurt-1438672.jpg",
    "pexels-foodie-factor-162291-539451.jpg", "pexels-janetrangdoan-793759.jpg",
    "pexels-karthik-reddy-130698-397913.jpg", "pexels-lum3n-44775-604969.jpg",
    "pexels-mali-64208.jpg", "pexels-marta-dzedyshko-1042863-2067423.jpg",
    "pexels-pascal-claivaz-66964-410648.jpg", "pexels-rajesh-tp-749235-1633525.jpg",
    "pexels-robinstickel-70497.jpg", "pexels-sebastian-coman-photography-1598188-3590401.jpg",
    "pexels-senuscape-728360-2313686.jpg", "pexels-sonnie-wing-2153439649-33133363.jpg",
    "pexels-tahaasamett-7764698.jpg", "pexels-valeriya-1639557.jpg", "pexels-valeriya-1860204.jpg",
    "pexels-valeriya-33106044.jpg", "pexels-vanmalidate-769289.jpg",
    "top-view-table-full-delicious-food-composition.jpg"
]

categories = ['Lunch', 'Dinner', 'Breakfast']
descriptions = [
    'Delicious and healthy.',
    'A great choice for your meal.',
    'Perfect for any time of the day.',
    'Freshly prepared and tasty.',
]

def generate_meals():
    with app.app_context():
        print("🧹 Deleting old data...")

        # Order of deletion matters: child → parent
        Order.query.delete()
        MenuItem.query.delete()
        Menu.query.delete()
        MealOption.query.delete()
        db.session.commit()

        print("👨‍🍳 Ensuring default caterer exists...")
        caterer = Caterer.query.first()
        if not caterer:
            caterer = Caterer(
                name="Default Caterer",
                email="caterer@example.com",
                phone="1234567890"
            )
            caterer.password = "defaultpassword"  # Use the password setter
            db.session.add(caterer)
            db.session.commit()

        print("🍽️ Seeding meal options...")
        for i in range(len(image_files)):
            name = meal_names[i % len(meal_names)]
            category = categories[i % len(categories)]
            description = descriptions[i % len(descriptions)]
            price = round(random.uniform(150, 600), 2)
            image_path = f"/images/meals/{image_files[i]}"

            meal = MealOption(
                name=name,
                description=f"{description} ({category})",
                price=price,
                image=image_path,
                caterer_id=caterer.id
            )
            db.session.add(meal)

        db.session.commit()
        print("✅ Meal seeding completed successfully!")

if __name__ == "__main__":
    generate_meals()
