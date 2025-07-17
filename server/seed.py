# seed.py
from extensions import db
from app import app  # or your Flask instance if named differently
from models.Menu import Menu
from models.Menu_item import MenuItem
from datetime import date

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create menus
        menu1 = Menu(menu_date=date(2025, 7, 16))
        menu2 = Menu(menu_date=date(2025, 7, 17))

        # Add items to menu1
        menu1.items = [
            MenuItem(name="Ugali"),
            MenuItem(name="Sukuma Wiki"),
            MenuItem(name="Beef Stew")
        ]

        # Add items to menu2
        menu2.items = [
            MenuItem(name="Chapati"),
            MenuItem(name="Ndengu"),
            MenuItem(name="Rice")
        ]

        # Add to session and commit
        db.session.add_all([menu1, menu2])
        db.session.commit()

        print("✅ Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
