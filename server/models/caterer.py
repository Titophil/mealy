
from server.extensions import db, bcrypt
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Caterer(db.Model, SerializerMixin):
    __tablename__ = 'caterers'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(15), nullable=False)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    meal_options = relationship('MealOption', back_populates='caterer', cascade='all, delete-orphan')
    orders = relationship('Order', back_populates='caterer', cascade='all, delete-orphan')
    menus = relationship('Menu', back_populates='caterer', cascade='all, delete-orphan')

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, value):
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Caterer {self.name}>'
