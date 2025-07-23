from flask import Blueprint, request, jsonify
from sqlalchemy import func
from datetime import datetime, timedelta
from server.models import Payment
from server.extensions import db
from server.services.daraja import lipa_na_mpesa, handle_mpesa_callback

payment_bp = Blueprint('payment_bp', __name__)

# Initiate STK push
@payment_bp.route("/api/pay", methods=["POST"])
def initiate_payment():
    data = request.get_json()
    phone = data.get("phone")
    amount = data.get("amount")

    if not phone or not amount:
        return jsonify({"error": "Phone and amount are required."}), 400

    try:
        result = lipa_na_mpesa(phone, amount)
        return jsonify({"message": "STK push sent", "details": result}), 200
    except Exception as e:
        print("Error initiating payment:", str(e))
        return jsonify({"error": "Failed to initiate payment"}), 500


# M-PESA callback handler
@payment_bp.route("/api/mpesa/callback", methods=["POST"])
def mpesa_callback():
    try:
        mpesa_data = request.get_json()
        print("🔔 Received M-PESA Callback:", mpesa_data)
        handle_mpesa_callback(mpesa_data)
        return jsonify({"ResultCode": 0, "ResultDesc": "Callback received and processed"}), 200
    except Exception as e:
        print("❌ Error processing callback:", str(e))
        return jsonify({"ResultCode": 1, "ResultDesc": "Processing failed"}), 500


# Revenue report endpoint
@payment_bp.route("/api/admin/revenue", methods=["GET"])
def get_revenue():
    today = datetime.utcnow().date()
    first_day_this_month = today.replace(day=1)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)
    last_day_last_month = first_day_this_month - timedelta(days=1)

    # Filter completed payments
    completed = Payment.query.filter_by(status="Completed")

    # Daily revenue for this month
    daily_revenue = (
        completed
        .filter(Payment.created_at >= first_day_this_month)
        .with_entities(
            func.date(Payment.created_at).label("date"),
            func.sum(Payment.amount).label("amount")
        )
        .group_by(func.date(Payment.created_at))
        .order_by(func.date(Payment.created_at))
        .all()
    )

    daily_data = [{"date": d.date.strftime("%Y-%m-%d"), "amount": float(d.amount)} for d in daily_revenue]

    # This month's total revenue
    this_month_total = (
        completed
        .filter(Payment.created_at >= first_day_this_month)
        .with_entities(func.sum(Payment.amount))
        .scalar()
    ) or 0

    # Last month's total revenue
    last_month_total = (
        completed
        .filter(Payment.created_at >= first_day_last_month, Payment.created_at <= last_day_last_month)
        .with_entities(func.sum(Payment.amount))
        .scalar()
    ) or 0

    # Today's revenue
    today_total = (
        completed
        .filter(func.date(Payment.created_at) == today)
        .with_entities(func.sum(Payment.amount))
        .scalar()
    ) or 0

    return jsonify({
        "daily": daily_data,
        "this_month_total": float(this_month_total),
        "last_month_total": float(last_month_total),
        "today_total": float(today_total)
    })
