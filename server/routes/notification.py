from flask import Blueprint, request, jsonify
from server.models.user import User
from server.models.Notification import Notification
from server.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

notification_bp = Blueprint('notification_bp', __name__, url_prefix='/notifications')

@notification_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([{
        'id': n.id,
        'message': n.message,
        'created_at': n.created_at.isoformat()
    } for n in notifications]), 200