from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy_serializer import SerializerMixin
from server.extensions import bcrypt, db

class Caterer(db.Model, SerializerMixin):
    __tablename__ = 'caterers'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(15), nullable=False)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    # Relationships
    meal_options = db.relationship(
        'MealOption',
        backref='caterer',
        cascade='all, delete-orphan'
    )
    orders = db.relationship(
        'Order',
        backref='caterer',
        cascade='all, delete-orphan'
    )
    menus = db.relationship(
        'Menu',
        backref='caterer',
        cascade='all, delete-orphan'
    )

    @hybrid_property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, value):
        self.password_hash = bcrypt.generate_password_hash(value).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Caterer {self.name}>'
