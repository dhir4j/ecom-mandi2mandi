from flask import Blueprint, request, jsonify, current_app, redirect
from flask_login import login_required, current_user
import uuid
import hashlib
from . import db
from .models import Order

payments_bp = Blueprint('payments', __name__)

def generate_hash(params, salt):
    """Generate PayU payment hash"""
    hash_string = f"{params['key']}|{params['txnid']}|{params['amount']}|{params['productinfo']}|{params['firstname']}|{params['email']}|||||||||||{salt}"
    return hashlib.sha512(hash_string.encode('utf-8')).hexdigest().lower()

def verify_hash(params, salt):
    """Verify PayU response hash"""
    hash_string = f"{salt}|{params.get('status')}|||||||||||{params.get('email')}|{params.get('firstname')}|{params.get('productinfo')}|{params.get('amount')}|{params.get('txnid')}|{params.get('key')}"
    return hashlib.sha512(hash_string.encode('utf-8')).hexdigest().lower()

@payments_bp.route('/initiate-payment', methods=['POST'])
@login_required
def initiate_payment():
    data = request.get_json()

    required_fields = [
        'amount', 'productName', 'quantity', 'unit', 'totalPrice', 
        'paymentOption', 'buyerName', 'mobile', 
        'pincode', 'addressLine1', 'city', 'state'
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    txnid = str(uuid.uuid4())
    
    # Create the order and save it to the DB with a 'Pending' status
    try:
        new_order = Order(
            user_id=current_user.id,
            product_name=data['productName'],
            quantity=float(data['quantity']),
            unit=data['unit'],
            total_price=float(data['totalPrice']),
            amount_paid=float(data['amount']),
            payment_option=data['paymentOption'],
            utr_code=txnid, # Temporarily use txnid for UTR
            buyer_name=data['buyerName'],
            buyer_mobile=data['mobile'],
            pincode=data['pincode'],
            address_line_1=data['addressLine1'],
            address_line_2=data.get('addressLine2', ''),
            city=data['city'],
            state=data['state'],
            status='Pending'
        )
        db.session.add(new_order)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create order: {str(e)}"}), 500

    # Prepare payment payload for PayU
    payu_params = {
        'key': current_app.config['PAYU_KEY'],
        'txnid': txnid,
        'amount': str(data['amount']),
        'productinfo': data['productName'],
        'firstname': current_user.name,
        'email': current_user.email,
        'phone': data['mobile'],
        'surl': 'https://www.mandi.ramhotravels.com/api/payment-success',
        'furl': 'https://www.mandi.ramhotravels.com/api/payment-failure',
    }

    # Generate hash
    try:
        payment_hash = generate_hash(payu_params, current_app.config['PAYU_SALT'])
        payu_params['hash'] = payment_hash
        
        # Use production URL
        payu_params['payu_url'] = 'https://secure.payu.in/_payment'
        
        return jsonify(payu_params)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/payment-success', methods=['POST'])
def payment_success():
    """Handle successful payment callback from PayU"""
    payu_data = request.form.to_dict()
    
    # Verify hash
    try:
        received_hash = payu_data.get('hash', '')
        calculated_hash = verify_hash(payu_data, current_app.config['PAYU_SALT'])
        
        if received_hash != calculated_hash:
            return redirect('https://mandi2mandi.com/confirmation?status=error&message=Invalid+hash')
        
        # Update order status
        order = Order.query.filter_by(utr_code=payu_data.get('txnid')).first()
        
        if order:
            order.status = 'Booked'
            order.utr_code = payu_data.get('mihpayid', payu_data.get('txnid'))  # Update with PayU transaction ID
            db.session.commit()
            
        return redirect(f'https://mandi2mandi.com/confirmation?status=success&txnid={payu_data.get("txnid")}')
    except Exception as e:
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')

@payments_bp.route('/payment-failure', methods=['POST'])
def payment_failure():
    """Handle failed payment callback from PayU"""
    payu_data = request.form.to_dict()
    
    try:
        # Update order status
        order = Order.query.filter_by(utr_code=payu_data.get('txnid')).first()
        
        if order:
            order.status = 'Failed'
            db.session.commit()
            
        return redirect(f'https://mandi2mandi.com/confirmation?status=failed&txnid={payu_data.get("txnid")}')
    except Exception as e:
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')

@payments_bp.route('/payment-status/<txnid>', methods=['GET'])
@login_required
def get_payment_status(txnid):
    """Get payment status for a transaction"""
    try:
        order = Order.query.filter_by(utr_code=txnid, user_id=current_user.id).first()
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        return jsonify({
            "txnid": txnid,
            "status": order.status,
            "amount": float(order.amount_paid),
            "product": order.product_name
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500