from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from server.extensions import db

class MealOption(db.Model):
    __tablename__ = 'meal_options'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    caterer_id = Column(Integer, ForeignKey('caterers.id'), nullable=False)

    def __repr__(self):
        return f"<MealOption {self.name} - ${self.price}>"
