# services/daraja.py
import base64, requests, os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

def get_access_token():
    consumer_key = os.getenv("CONSUMER_KEY")
    consumer_secret = os.getenv("CONSUMER_SECRET")
    auth = (consumer_key, consumer_secret)

    response = requests.get(
         "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
         auth=auth
    )

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        raise Exception("Failed to get access token: " + response.text)

def lipa_na_mpesa(phone_number, amount):
    access_token = get_access_token()
    shortcode = os.getenv("BUSINESS_SHORTCODE")
    passKey = os.getenv("PASSKEY")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

    data_to_encode = shortcode + passKey + timestamp
    password = base64.b64encode(data_to_encode.encode()).decode()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": os.getenv("CALLBACK_URL"),
        "AccountReference": "OrderPayment",
        "TransactionDesc": "Payment for food order"
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers
    )

    return response.json()

def handle_mpesa_callback(mpesa_data):
    """
    Placeholder to process callback data.
    You can log it, store it in a database, or verify transaction details.
    """
    print("M-PESA Callback received and handled:")
    print(mpesa_data)
