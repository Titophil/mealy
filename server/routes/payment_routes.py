from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime, timedelta
from server.models import Payment
from server.extensions import db
from server.services.daraja import lipa_na_mpesa, handle_mpesa_callback

payment_bp = Blueprint('payment_bp', __name__)

@payment_bp.route("/api/payment/initiate", methods=["POST"])
def initiate_payment():
    data = request.get_json()
    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"error": "Phone and amount are required."}), 400

    try:
        result = lipa_na_mpesa(phone, amount)
        print(f"STK Push Response: {result}")
        if result.get('ResponseCode') == '0':
            return jsonify({"message": "STK push initiated successfully", "response": result}), 200
        else:
            error_desc = result.get('errorMessage', result.get('ResponseDescription', 'Unknown M-Pesa error'))
            print(f"STK Push Error: {error_desc}")
            return jsonify({"error": f"M-Pesa error: {error_desc}"}), 400
    except Exception as e:
        error_msg = str(e)
        print(f"STK Push Exception: {error_msg}")
        return jsonify({"error": f"Failed to initiate M-Pesa STK push: {error_msg}"}), 500

@payment_bp.route("/api/payment/callback", methods=["POST"])
def mpesa_callback():
    try:
        mpesa_data = request.get_json()
        print("📩 Received M-PESA callback:", mpesa_data)
        handle_mpesa_callback(mpesa_data)
        return jsonify({"ResultCode": 0, "ResultDesc": "Callback received"}), 200
    except Exception as e:
        print("❌ Callback processing error:", str(e))
        return jsonify({"ResultCode": 1, "ResultDesc": "Callback processing failed"}), 500

@payment_bp.route("/api/payment/revenue", methods=["GET"])
def get_revenue():
    today = datetime.utcnow().date()
    first_day_this_month = today.replace(day=1)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
    last_day_last_month = first_day_this_month - timedelta(days=1)

    completed = Payment.query.filter_by(status="Completed")

    daily_revenue = (
        completed.filter(Payment.created_at >= first_day_this_month)
        .with_entities(
            func.date(Payment.created_at).label("date"),
            func.sum(Payment.amount).label("amount")
        )
        .group_by(func.date(Payment.created_at))
        .order_by(func.date(Payment.created_at))
        .all()
    )
    daily_data = [
        {"date": d.date.strftime("%Y-%m-%d"), "amount": float(d.amount)}
        for d in daily_revenue
    ]

    this_month_total = completed.filter(Payment.created_at >= first_day_this_month).with_entities(func.sum(Payment.amount)).scalar() or 0
    last_month_total = completed.filter(Payment.created_at >= first_day_last_month, Payment.created_at <= last_day_last_month).with_entities(func.sum(Payment.amount)).scalar() or 0
    today_total = completed.filter(func.date(Payment.created_at) == today).with_entities(func.sum(Payment.amount)).scalar() or 0

    return jsonify({
        "daily": daily_data,
        "this_month_total": float(this_month_total),
        "last_month_total": float(last_month_total),
        "today_total": float(today_total)
    }), 200