from flask import Blueprint, request, jsonify
from server.services.daraja import lipa_na_mpesa, handle_mpesa_callback


payment_bp = Blueprint('payment_bp', __name__)

# Route to initiate STK push
@payment_bp.route("/api/pay", methods=["POST"])
def pay():
    data = request.get_json()
    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"error": "Phone and amount are required"}), 400

    result = lipa_na_mpesa(phone, amount)
    return jsonify(result)

# Route to receive callback from Safaricom
@payment_bp.route("/api/mpesa/callback", methods=["POST"])
def mpesa_callback():
    mpesa_data = request.get_json()
    print("Received mpesa callback:", mpesa_data)
    handle_mpesa_callback(mpesa_data)  # Optional: Save to DB, log, update payment status
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})
