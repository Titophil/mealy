from server.extensions import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship



class Menu(db.Model):
    __tablename__ ='menus'

    id = db.Column(db.Integer,primary_key=True)
    menu_date=db.Column(db.Date,nullable=False)
    caterer_id = Column(Integer, ForeignKey('caterers.id'), nullable=False)


    items= db.relationship('MenuItem', back_populates='menu',cascade='all, delete-orphan')
    caterer_id = db.Column(db.Integer, db.ForeignKey('caterers.id'), nullable=False)
