from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meal_option_id = db.Column(db.Integer, db.ForeignKey('meal_options.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    price = db.Column(db.Float, nullable=False)