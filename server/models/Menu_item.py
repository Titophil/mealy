from extensions import db
from sqlalchemy import ForeignKey



class MenuItem(db.Model):
    __tablename__ ='menu_items'

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    menu_id=db.Column(db.Integer,ForeignKey('menus.id'),nullable=False)


    menu = db.relationship('Menu', back_populates='items')
    

