
from server.extensions import db
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship

class MealOption(db.Model):
    __tablename__ = 'meal_options'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)
    price = Column(Float)
    image = Column(String)

    caterer_id = Column(Integer, ForeignKey('caterers.id'), nullable=True)
    caterer = relationship('Caterer', back_populates='meal_options')
    menu_items = relationship('MenuItem', back_populates='meal_option', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<MealOption {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image": self.image
        }
