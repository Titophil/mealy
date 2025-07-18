from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db



db = SQLAlchemy()


class Caterer(db.Model):
    __tablename__ = 'caterers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

class MealOption(db.Model):
    __tablename__ = 'meal_options'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    caterer_id = db.Column(db.Integer, db.ForeignKey('caterers.id'))

    caterer = db.relationship("Caterer", backref="meal_options")