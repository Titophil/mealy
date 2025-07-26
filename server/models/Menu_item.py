
from server.extensions import db
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    menu_id = Column(Integer, ForeignKey('menus.id'), nullable=False)
    meal_option_id = Column(Integer, ForeignKey('meal_options.id'), nullable=True)

    menu = relationship('Menu', back_populates='items')
    meal_option = relationship('MealOption', back_populates='menu_items')
    orders = relationship('Order', back_populates='menu_item', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<MenuItem {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "meal_option_id": self.meal_option_id,
            "menu_id": self.menu_id,
            "image_url": self.meal_option.image if self.meal_option else None,
            "description": self.meal_option.description if self.meal_option else "",
            "price": self.meal_option.price if self.meal_option else None
        }