# seed_user.py

from server.app import create_app
from server.models.user import User, db, bcrypt

app = create_app()

users_to_seed = [
    {
        "email": "admin@example.com",
        "password": "admin123",
        "role": "admin",
        "caterer_id": None
    },
    {
        "email": "customer1@example.com",
        "password": "customer123",
        "role": "customer",
        "caterer_id": None
    },
    {
        "email": "caterer1@example.com",
        "password": "caterer123",
        "role": "caterer",
        "caterer_id": 1  # Adjust as per your data
    },
    {
        "email": "customer2@example.com",
        "password": "customer456",
        "role": "customer",
        "caterer_id": None
    },
]

with app.app_context():
    for u in users_to_seed:
        if User.query.filter_by(email=u["email"]).first():
            print(f"User with email {u['email']} already exists.")
            continue

        hashed_password = bcrypt.generate_password_hash(u["password"]).decode("utf-8")
        user = User(
            email=u["email"],
            role=u["role"],
            caterer_id=u["caterer_id"],
            password_hash=hashed_password
        )
        db.session.add(user)
        print(f"Added user: {u['email']}")

    db.session.commit()
    print("Seeding complete.")
