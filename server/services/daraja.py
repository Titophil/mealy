import requests
import base64
from datetime import datetime
from flask import current_app as app

def get_access_token():
    consumer_key = app.config['DARAJA_CONSUMER_KEY']
    consumer_secret = app.config['DARAJA_CONSUMER_SECRET']
    api_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    
    try:
        auth = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()
        headers = {'Authorization': f'Basic {auth}'}
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Error getting access token: {str(e)}")
        raise

def initiate_stk_push(amount, phone_number, order_id):
    access_token = get_access_token()
    api_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    shortcode = app.config['DARAJA_SHORTCODE']
    passkey = app.config.get('DARAJA_PASSKEY', 'your_passkey')
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()
    
    callback_url = 'https://14c747bcc0f9.ngrok-free.app/payments/api/payment/callback'
    
    payload = {
        'BusinessShortCode': shortcode,
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': amount,
        'PartyA': phone_number,
        'PartyB': shortcode,
        'PhoneNumber': phone_number,
        'CallBackURL': callback_url,
        'AccountReference': f"Order_{order_id}",
        'TransactionDesc': f"Payment for Order {order_id}"
    }
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error initiating STK push: {str(e)}")
        raise