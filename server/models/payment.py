from datetime import datetime
from server.extensions import db


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    phone_number = db.Column(db.String(15), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Pending")
    mpesa_receipt_number = db.Column(db.String(100), nullable=True)
    merchant_request_id = db.Column(db.String(100), nullable=True)
    checkout_request_id = db.Column(db.String(100), nullable=True)


    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    
    user = db.relationship("User", backref="payments")
    order = db.relationship("Order", backref="payment", uselist=False)
