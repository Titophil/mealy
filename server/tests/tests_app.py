import pytest
import json
import os
from app import app, db, bcrypt 

@pytest.fixture(scope='session')
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('TEST_DATABASE_URL', 'sqlite:///:memory:')
    app.config['JWT_SECRET_KEY'] = 'test-secret-key' 

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_signup_customer(client):
    response = client.post('/signup', json={
        'email': 'test_customer@example.com',
        'password': 'testpassword123'
    })
    assert response.status_code == 201
    assert json.loads(response.data) == {'message': 'User created successfully'}

    response = client.post('/signup', json={
        'email': 'test_customer@example.com',
        'password': 'anotherpassword'
    })
    assert response.status_code == 400
    assert json.loads(response.data) == {'error': 'Email already exists'}

def test_login_customer(client):
    client.post('/signup', json={
        'email': 'login_customer@example.com',
        'password': 'loginpass'
    })

    response = client.post('/login', json={
        'email': 'login_customer@example.com',
        'password': 'loginpass'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    assert data['user']['email'] == 'login_customer@example.com'

    response = client.post('/login', json={
        'email': 'login_customer@example.com',
        'password': 'wrongpass'
    })
    assert response.status_code == 401
    assert json.loads(response.data) == {'error': 'Invalid email or password'}

