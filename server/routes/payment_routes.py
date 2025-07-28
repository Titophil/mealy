from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Order, Payment
from server.services.daraja import initiate_stk_push
from flask import current_app as app

payment_bp = Blueprint('payments', __name__)

@payment_bp.route('/api/payment/stk-push', methods=['POST'])
def stk_push():
    try:
        data = request.get_json()
        amount = data.get('amount')
        phone_number = data.get('phone_number')
        order_id = data.get('order_id')

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        response = initiate_stk_push(amount, phone_number, order_id)
        order.checkout_request_id = response.get('CheckoutRequestID')
        db.session.commit()

        return jsonify({
            "message": "STK push initiated successfully",
            "response": response
        }), 200
    except Exception as e:
        print(f"Error initiating STK push: {str(e)}")
        return jsonify({"error": str(e)}), 500

@payment_bp.route('/api/payment/callback', methods=['POST'])
def mpesa_callback():
    try:
        data = request.get_json()
        print(f"📩 Received M-PESA callback: {data}")

        callback_data = data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = callback_data.get('CheckoutRequestID')
        result_code = callback_data.get('ResultCode')
        result_desc = callback_data.get('ResultDesc')

        order = Order.query.filter_by(checkout_request_id=checkout_request_id).first()
        if not order:
            print(f"Order not found for CheckoutRequestID: {checkout_request_id}")
            return jsonify({"error": "Order not found"}), 404

        if result_code == 0:
            callback_metadata = callback_data.get('CallbackMetadata', {}).get('Item', [])
            metadata = {item['Name']: item['Value'] for item in callback_metadata}
            amount = metadata.get('Amount')
            transaction_id = metadata.get('MpesaReceiptNumber')
            phone_number = metadata.get('PhoneNumber')

            payment = Payment(
                order_id=order.id,
                amount=amount,
                transaction_id=transaction_id,
                phone_number=phone_number,
                status='Completed',
                created_at=app.extensions['db'].func.now()
            )
            order.paid = True
            db.session.add(payment)
            db.session.commit()
            print(f"Payment saved: {payment.status}, Amount: {amount}, Transaction ID: {transaction_id}")
        else:
            print(f"M-PESA Callback failed: {result_desc}")
            payment = Payment(
                order_id=order.id,
                amount=0,
                transaction_id=None,
                phone_number=None,
                status=f'Failed: {result_desc}',
                created_at=app.extensions['db'].func.now()
            )
            db.session.add(payment)
            db.session.commit()

        return jsonify({"message": "Callback processed"}), 200
    except Exception as e:
        print(f"Error processing callback: {str(e)}")
        return jsonify({"error": str(e)}), 500