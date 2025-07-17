from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models.user import User, db, bcrypt
from models.order import Order
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user and user.role == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify({"msg": "Admin access required"}), 403
        return decorator
    return wrapper


with app.app_context():
    db.create_all()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')
    caterer_id = data.get('caterer_id') 
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(email=email, role=role, caterer_id=caterer_id)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email
        }
    }), 200

@app.route('/user/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    orders = Order.query.filter_by(user_id=user_id).all()
    order_list = [{
        'id': order.id,
        'meal_option_id': order.meal_option_id,
        'order_date': order.order_date.isoformat(),
        'price': order.price
    } for order in orders]
    
    return jsonify({'orders': order_list}), 200

if __name__ == '__main__':
    app.run(debug=True)