
from server.extensions import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Menu(db.Model):
    __tablename__ = 'menus'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    menu_date = Column(DateTime, nullable=False)
    caterer_id = Column(Integer, ForeignKey('caterers.id'), nullable=True)

    items = relationship('MenuItem', back_populates='menu', cascade='all, delete-orphan')
    caterer = relationship('Caterer', back_populates='menus')

    def __repr__(self):
        return f"<Menu {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "menu_date": self.menu_date.isoformat() if self.menu_date else None,
            "caterer_id": self.caterer_id
        }
