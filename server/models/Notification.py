from server.extensions import db
from sqlalchemy import ForeignKey
from datetime import Date

class Notification(db.Model):
    __tablename__ ='notifications'


    id =db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,ForeignKey('User'),nullable=False)
    menu_id=db.Column(db.Integer,ForeignKey('Menu'),nullable=False)
    message=db.Column(db.String(300),nullable=False)
    send_at=db.Column(db.Date,nullable=False)