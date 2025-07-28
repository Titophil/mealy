import base64
import requests
import os
from dotenv import load_dotenv
from datetime import datetime
from server.models import Payment
from server.extensions import db

load_dotenv()

def get_access_token():
    consumer_key = os.getenv("CONSUMER_KEY")
    consumer_secret = os.getenv("CONSUMER_SECRET")
    auth = (consumer_key, consumer_secret)

    try:
        response = requests.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            auth=auth
        )
        response.raise_for_status()
        token = response.json().get("access_token")
        print(f"Access Token: {token[:10]}...")
        return token
    except requests.RequestException as e:
        print(f"Access Token Error: {str(e)}")
        raise Exception(f"Failed to get access token: {str(e)}")

def lipa_na_mpesa(phone_number, amount):
    access_token = get_access_token()
    shortcode = os.getenv("DARAJA_SHORTCODE")
    passkey = os.getenv("PASSKEY")
    callback_url = os.getenv("CALLBACK_URL")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

    # Validate inputs
    if not shortcode or not passkey or not callback_url:
        raise ValueError(f"Missing environment variables: shortcode={shortcode}, passkey={passkey}, callback_url={callback_url}")
    if not phone_number.startswith("254") or len(phone_number) != 12 or not phone_number.isdigit():
        raise ValueError(f"Invalid phone number format: {phone_number} (must be 2547xxxxxxxx)")
    if not isinstance(amount, (int, float)) or amount <= 0 or amount > 150000:
        raise ValueError(f"Invalid amount: {amount} (must be 1-150000)")
    if not callback_url.startswith("https://"):
        raise ValueError(f"Callback URL must be HTTPS: {callback_url}")

    data_to_encode = shortcode + passkey + timestamp
    password = base64.b64encode(data_to_encode.encode()).decode()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": "OrderPayment",
        "TransactionDesc": "Payment for food order"
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    try:
        print(f"STK Push Payload: {payload}")
        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        result = response.json()
        print(f"STK Push Response: {result}")
        return result
    except requests.RequestException as e:
        error_response = e.response.json() if e.response and e.response.content else {"errorMessage": str(e)}
        print(f"STK Push Error: {str(e)}, Response: {error_response}")
        raise Exception(f"Failed to initiate STK push: {error_response.get('errorMessage', str(e))}")

def handle_mpesa_callback(mpesa_data):
    print("M-PESA Callback received:", mpesa_data)
    try:
        result_code = mpesa_data['Body']['stkCallback']['ResultCode']
        checkout_request_id = mpesa_data['Body']['stkCallback']['CheckoutRequestID']
        status = 'Completed' if result_code == 0 else 'Failed'
        result_desc = mpesa_data['Body']['stkCallback'].get('ResultDesc', '')

        if result_code == 0:
            metadata = mpesa_data['Body']['stkCallback']['CallbackMetadata']['Item']
            amount = next(item['Value'] for item in metadata if item['Name'] == 'Amount')
            receipt = next(item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber')
            phone = next(item['Value'] for item in metadata if item['Name'] == 'PhoneNumber')
        else:
            amount = 0
            receipt = None
            phone = None

        payment = Payment(
            checkout_request_id=checkout_request_id,
            amount=amount,
            phone_number=phone,
            receipt_number=receipt,
            status=status,
            result_desc=result_desc,
            created_at=datetime.utcnow()
        )
        db.session.add(payment)
        db.session.commit()
        print(f"Payment saved: {status}, Amount: {amount}, Receipt: {receipt}")
    except Exception as e:
        print(f"Error processing callback: {e}")