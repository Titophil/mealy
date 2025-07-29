from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from server.extensions import db


class Order(db.Model):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    menu_item_id = Column(Integer, ForeignKey('menu_items.id'), nullable=False)
    caterer_id = Column(Integer, ForeignKey('caterers.id'), nullable=True)
    status = Column(String, default='pending', nullable=False)  # Add status column
    order_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    meal_option_id = db.Column(db.Integer, db.ForeignKey('meal_options.id'))

    user = relationship('User', back_populates='orders')
    menu_item = relationship('MenuItem', back_populates='orders')
    caterer = relationship('Caterer', back_populates='orders')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'order_date', name='uix_user_date'),
    )

    def __repr__(self):
        return f"<Order user_id={self.user_id}, menu_item_id={self.menu_item_id}, date={self.order_date}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "menu_item_id": self.menu_item_id,
            "status": self.status,
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }