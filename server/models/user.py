
from server.extensions import db, bcrypt
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(50), nullable=False, default='user')
    created_at = Column(DateTime, server_default=db.func.now())

    orders = relationship('Order', back_populates='user', cascade='all, delete-orphan')

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, value):
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
