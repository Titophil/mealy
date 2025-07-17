from extensions import db



class Menu(db.Model):
    __tablename__ ='menus'

    id = db.Column(db.Integer,primary_key=True)
    menu_date=db.Column(db.Date,nullable=False)


    items= db.relationship('MenuItem', back_populates='menu',cascade='all, delete-orphan')
