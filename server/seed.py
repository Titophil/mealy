from flask import Blueprint
from server.extensions import db, bcrypt
from server.models.user import User

seed_bp = Blueprint('seed', __name__)

def seed_data():
    """Seed the database with initial test data."""
    try:
        # Check if users already exist to avoid duplicates
        if User.query.count() > 0:
            print("Database already contains users. Skipping seeding.")
            return

        # Create a regular user
        user = User(
            email="test@example.com",
            name="Test User",
            role="customer"
        )
        user.password = "password"  # Hashed by User model's password setter
        db.session.add(user)

        # Create an admin user
        admin = User(
            email="admin@admin.gmail.com",
            name="Admin User",
            role="admin"
        )
        admin.password = "adminpassword"  # Hashed by User model's password setter
        db.session.add(admin)

        # Commit the changes
        db.session.commit()
        print("Successfully seeded database with test users.")

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding database: {str(e)}")

def register_commands(app):
    """Register the seed command with the Flask app."""
    @app.cli.command("seed")
    def seed_command():
        """Run the database seeder."""
        seed_data()

# Automatically register commands when the module is imported
def init_app(app):
    register_commands(app)