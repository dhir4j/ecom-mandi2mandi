from flask import Blueprint, request, jsonify, current_app, redirect
from flask_login import login_required, current_user
import uuid
import hashlib
import re
from . import db
from .models import Order, Inquiry, Cart, CartItem
from .sabpaisa_utils import (
    build_payment_request,
    create_encrypted_request,
    parse_callback_response
)
from .airpay_utils import (
    build_payment_request as build_airpay_request,
    validate_callback_response as validate_airpay_response
)

payments_bp = Blueprint('payments', __name__)

def split_name_for_airpay(full_name):
    """
    Split full name into first and last name for Airpay
    Handles edge cases:
    - Empty name
    - Single word name
    - Special characters (sanitizes for Airpay)

    Returns:
        tuple: (first_name, last_name) both sanitized for Airpay
    """
    import re

    if not full_name or not full_name.strip():
        return ("User", "User")

    # Remove special characters (Airpay requires alphanumeric + spaces only)
    sanitized = re.sub(r'[^A-Za-z0-9\s]', '', full_name.strip())

    # Remove extra spaces
    sanitized = ' '.join(sanitized.split())

    if not sanitized:
        return ("User", "User")

    # Split name
    parts = sanitized.split(' ', 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else parts[0]

    # Ensure both are at least 1 character (Airpay requirement)
    if not first_name:
        first_name = "User"
    if not last_name:
        last_name = first_name

    return (first_name, last_name)

@payments_bp.route('/test-airpay-checksum', methods=['GET'])
def test_airpay_checksum():
    """
    Test endpoint to verify Airpay checksum calculation
    Access at: /api/test-airpay-checksum
    """
    import hashlib
    from datetime import datetime
    from flask import current_app

    # Test data
    buyer_email = "test@example.com"
    buyer_first_name = "Test"
    buyer_last_name = "User"
    amount = "199.00"
    order_id = "TXN123456789"
    today = datetime.now().strftime("%Y-%m-%d")

    # Get config
    merchant_id = current_app.config.get('AIRPAY_MERCHANT_ID', 'NOT SET')
    username = current_app.config.get('AIRPAY_USERNAME', 'NOT SET')
    password = current_app.config.get('AIRPAY_PASSWORD', 'NOT SET')
    secret_key = current_app.config.get('AIRPAY_SECRET_KEY', 'NOT SET')

    # Build alldata
    alldata = buyer_email + buyer_first_name + buyer_last_name + amount + order_id

    # Generate privatekey
    privatekey_data = f"{secret_key}@{username}:|:{password}"
    privatekey = hashlib.sha256(privatekey_data.encode('utf-8')).hexdigest()

    # Generate key_sha256
    key_data = f"{username}~:~{password}"
    key_sha256 = hashlib.sha256(key_data.encode('utf-8')).hexdigest()

    # Calculate checksum
    checksum_data = alldata + today
    checksum_input = f"{key_sha256}@{checksum_data}"
    checksum = hashlib.sha256(checksum_input.encode('utf-8')).hexdigest()

    # Generate UID
    uid = hashlib.sha256(f"{username}{order_id}{today}".encode('utf-8')).hexdigest()

    return jsonify({
        "test_data": {
            "buyerEmail": buyer_email,
            "buyerFirstName": buyer_first_name,
            "buyerLastName": buyer_last_name,
            "amount": amount,
            "orderid": order_id,
            "today": today
        },
        "config_status": {
            "merchant_id": merchant_id,
            "username": username,
            "password": "SET" if password != "NOT SET" and password else "NOT SET",
            "secret_key": "SET" if secret_key != "NOT SET" and secret_key else "NOT SET"
        },
        "calculations": {
            "alldata": alldata,
            "privatekey": privatekey,
            "key_sha256": key_sha256,
            "checksum_data": checksum_data,
            "checksum": checksum,
            "UID": uid
        },
        "airpay_params": {
            "buyerEmail": buyer_email,
            "buyerPhone": "0000000000",
            "buyerFirstName": buyer_first_name,
            "buyerLastName": buyer_last_name,
            "buyerAddress": "",
            "buyerCity": "",
            "buyerState": "",
            "buyerCountry": "",
            "buyerPinCode": "",
            "orderid": order_id,
            "amount": amount,
            "UID": uid,
            "privatekey": privatekey,
            "mercid": merchant_id,
            "kittype": "inline",
            "checksum": checksum,
            "currency": "356",
            "isocurrency": "INR"
        }
    }), 200

def sanitize_payer_name(name):
    """
    Sanitize payer name for SabPaisa gateway
    - Removes special characters that SabPaisa doesn't allow
    - If name looks like an email, extracts the username part
    - Returns only alphanumeric characters and spaces
    """
    if not name:
        return "Customer"

    # If it's an email address, extract the part before @
    if '@' in name:
        name = name.split('@')[0]

    # Remove special characters, keep only letters, numbers, and spaces
    sanitized = re.sub(r'[^a-zA-Z0-9\s]', '', name)

    # Remove extra spaces and capitalize
    sanitized = ' '.join(sanitized.split()).title()

    # If after sanitization the name is empty, return a default
    return sanitized if sanitized else "Customer"

def generate_hash(params, salt):
    """Generate PayU payment hash"""
    # Extract UDF fields (udf1 through udf10)
    udf1 = params.get('udf1', '')
    udf2 = params.get('udf2', '')
    udf3 = params.get('udf3', '')
    udf4 = params.get('udf4', '')
    udf5 = params.get('udf5', '')
    udf6 = params.get('udf6', '')
    udf7 = params.get('udf7', '')
    udf8 = params.get('udf8', '')
    udf9 = params.get('udf9', '')
    udf10 = params.get('udf10', '')

    hash_string = f"{params['key']}|{params['txnid']}|{params['amount']}|{params['productinfo']}|{params['firstname']}|{params['email']}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}|{udf6}|{udf7}|{udf8}|{udf9}|{udf10}|{salt}"
    return hashlib.sha512(hash_string.encode('utf-8')).hexdigest().lower()

def verify_hash(params, salt):
    """Verify PayU response hash"""
    # Extract UDF fields from response
    udf1 = params.get('udf1', '')
    udf2 = params.get('udf2', '')
    udf3 = params.get('udf3', '')
    udf4 = params.get('udf4', '')
    udf5 = params.get('udf5', '')
    udf6 = params.get('udf6', '')
    udf7 = params.get('udf7', '')
    udf8 = params.get('udf8', '')
    udf9 = params.get('udf9', '')
    udf10 = params.get('udf10', '')

    hash_string = f"{salt}|{params.get('status')}||||||||||{udf10}|{udf9}|{udf8}|{udf7}|{udf6}|{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{params.get('email')}|{params.get('firstname')}|{params.get('productinfo')}|{params.get('amount')}|{params.get('txnid')}|{params.get('key')}"
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

    # Get selected gateway (default to PayU for backward compatibility)
    gateway = data.get('gateway', 'payu').lower()

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

    try:
        if gateway == 'sabpaisa':
            # SabPaisa payment gateway
            client_code = current_app.config['SABPAISA_CLIENT_CODE']

            # Log for debugging
            print(f"[SABPAISA DEBUG] Client Code: {client_code}")
            print(f"[SABPAISA DEBUG] Base URL: {current_app.config['SABPAISA_BASE_URL']}")

            # Sanitize payer name to remove special characters
            sanitized_name = sanitize_payer_name(current_user.name)

            # Build parameter string (clientCode must be in BOTH encData AND as separate form field)
            params_str = build_payment_request(
                payer_name=sanitized_name,
                payer_email=current_user.email,
                payer_mobile=data['mobile'],
                client_txn_id=txnid,
                amount=float(data['amount']),
                client_code=client_code,
                trans_username=current_app.config['SABPAISA_USERNAME'],
                trans_password=current_app.config['SABPAISA_PASSWORD'],
                callback_url='https://www.mandi.ramhotravels.com/api/sabpaisa-payment-success',
                udf1=data['productName']  # Store product name in UDF1
            )

            print(f"[SABPAISA DEBUG] Params string (first 200 chars): {params_str[:200]}")

            # Encrypt the request
            enc_data = create_encrypted_request(
                params_str,
                current_app.config['SABPAISA_AUTH_KEY'],
                current_app.config['SABPAISA_AUTH_IV']
            )

            print(f"[SABPAISA DEBUG] Encrypted data length: {len(enc_data)}")
            print(f"[SABPAISA DEBUG] Encrypted data (first 50 chars): {enc_data[:50]}")

            return jsonify({
                'gateway': 'sabpaisa',
                'sabpaisa_url': current_app.config['SABPAISA_BASE_URL'],
                'encData': enc_data,
                'clientCode': client_code
            })
        elif gateway == 'airpay':
            # Airpay V4 payment gateway
            # Split buyer name into first and last name (sanitized for Airpay)
            buyer_first_name, buyer_last_name = split_name_for_airpay(current_user.name)

            # Build Airpay V4 payment request with OAuth2
            airpay_params = build_airpay_request(
                buyer_email=current_user.email or "",
                buyer_first_name=buyer_first_name,
                buyer_last_name=buyer_last_name,
                buyer_phone=data['mobile'],
                buyer_address=data['addressLine1'],
                buyer_city=data['city'],
                buyer_state=data['state'],
                buyer_country='India',
                buyer_pincode=data['pincode'],
                amount=f"{float(data['amount']):.2f}",
                order_id=txnid,
                currency='356',  # INR currency code
                iso_currency='INR',
                merchant_id=current_app.config['AIRPAY_MERCHANT_ID'],
                username=current_app.config['AIRPAY_USERNAME'],
                password=current_app.config['AIRPAY_PASSWORD'],
                secret_key=current_app.config['AIRPAY_SECRET_KEY'],
                client_id=current_app.config['AIRPAY_CLIENT_ID'],
                client_secret=current_app.config['AIRPAY_CLIENT_SECRET'],
            )

            airpay_params['gateway'] = 'airpay'

            return jsonify(airpay_params)
        else:
            # PayU payment gateway (default)
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
            payment_hash = generate_hash(payu_params, current_app.config['PAYU_SALT'])
            payu_params['hash'] = payment_hash
            payu_params['gateway'] = 'payu'

            # Use production URL
            payu_params['payu_url'] = 'https://secure.payu.in/_payment'

            return jsonify(payu_params)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/initiate-cart-payment', methods=['POST'])
@login_required
def initiate_cart_payment():
    """
    Initiate payment for all items in cart
    Creates orders for each cart item and returns payment gateway params
    """
    data = request.get_json()

    required_fields = [
        'paymentOption', 'buyerName', 'mobile',
        'pincode', 'addressLine1', 'city', 'state'
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Get user's cart
        cart = Cart.query.filter_by(user_id=current_user.id).first()

        if not cart or len(cart.items) == 0:
            return jsonify({"error": "Cart is empty"}), 400

        # Get selected gateway (default to PayU for backward compatibility)
        gateway = data.get('gateway', 'payu').lower()

        # Generate unique transaction ID for this cart checkout
        txnid = str(uuid.uuid4())

        # Calculate total amount
        total_amount = sum([item.quantity * item.price_per_unit for item in cart.items])

        # Create orders for each cart item
        created_orders = []
        for item in cart.items:
            item_total = item.quantity * item.price_per_unit
            new_order = Order(
                user_id=current_user.id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit=item.unit,
                total_price=item_total,
                amount_paid=item_total,
                payment_option=data['paymentOption'],
                utr_code=txnid,  # Same txnid for all items in this cart checkout
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
            created_orders.append(new_order)

        db.session.commit()

        # Prepare payment gateway params based on gateway selection
        if gateway == 'sabpaisa':
            # SabPaisa payment gateway
            client_code = current_app.config['SABPAISA_CLIENT_CODE']
            payment_request = build_payment_request(
                client_code=client_code,
                transaction_id=txnid,
                amount=total_amount,
                buyer_name=data['buyerName'],
                buyer_email=current_user.email,
                buyer_phone=data['mobile'],
                currency='INR'
            )

            sabpaisa_params = create_encrypted_request(payment_request)
            sabpaisa_params['sabpaisa_url'] = current_app.config['SABPAISA_BASE_URL']
            return jsonify(sabpaisa_params)

        elif gateway == 'airpay':
            # Airpay V4 payment gateway
            buyer_first_name, buyer_last_name = split_name_for_airpay(data['buyerName'])

            # Generate product description
            product_desc = f"Cart checkout - {len(cart.items)} items"

            airpay_params = build_airpay_request(
                buyer_email=current_user.email,
                buyer_phone=data['mobile'],
                buyer_first_name=buyer_first_name,
                buyer_last_name=buyer_last_name,
                amount=total_amount,
                order_id=txnid,
                product_details=product_desc
            )

            airpay_params['airpay_url'] = current_app.config['AIRPAY_BASE_URL']
            return jsonify(airpay_params)

        else:
            # PayU payment gateway (default)
            key = current_app.config['PAYU_KEY']
            salt = current_app.config['PAYU_SALT']

            # Generate product description
            product_name = f"Cart checkout - {len(cart.items)} items"

            amount_str = f"{total_amount:.2f}"
            email = current_user.email
            productinfo = product_name
            firstname = data['buyerName']
            phone = data['mobile']

            # Generate hash
            hash_string = f"{key}|{txnid}|{amount_str}|{productinfo}|{firstname}|{email}|||||||||||{salt}"
            hash_value = hashlib.sha512(hash_string.encode('utf-8')).hexdigest()

            # Payment parameters
            payu_params = {
                'key': key,
                'txnid': txnid,
                'amount': amount_str,
                'productinfo': productinfo,
                'firstname': firstname,
                'email': email,
                'phone': phone,
                'surl': f"{current_app.config.get('FRONTEND_URL', 'https://mandi2mandi.com')}/payment-success",
                'furl': f"{current_app.config.get('FRONTEND_URL', 'https://mandi2mandi.com')}/payment-failure",
                'hash': hash_value
            }

            # Use production URL
            payu_params['payu_url'] = 'https://secure.payu.in/_payment'

            return jsonify(payu_params)

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to initiate cart payment: {str(e)}'}), 500

@payments_bp.route('/payment-success', methods=['POST'])
def payment_success():
    """Handle successful payment callback from PayU"""
    payu_data = request.form.to_dict()
    
    # Verify hash
    try:
        received_hash = payu_data.get('hash', '')
        calculated_hash = verify_hash(payu_data, current_app.config['PAYU_SALT'])
        
        if received_hash != calculated_hash:
            # FIXED: Using correct frontend URL
            return redirect('https://mandi2mandi.com/confirmation?status=error&message=Invalid+hash')
        
        # Update order status
        order = Order.query.filter_by(utr_code=payu_data.get('txnid')).first()

        if order:
            order.status = 'Booked'
            order.utr_code = payu_data.get('mihpayid', payu_data.get('txnid'))  # Update with PayU transaction ID

            # Clear cart after successful payment (for cart checkout)
            # This will only clear if it was a cart checkout (multiple orders with same txnid)
            user_cart = Cart.query.filter_by(user_id=order.user_id).first()
            if user_cart:
                CartItem.query.filter_by(cart_id=user_cart.id).delete()

            db.session.commit()
        
        # FIXED: Using correct frontend URL    
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
        
        # FIXED: Using correct frontend URL    
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


# ============================================
# SUBSCRIPTION PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/get-payu-hash', methods=['POST'])
@login_required
def get_payu_hash():
    """
    Generate PayU hash, SabPaisa encrypted data, or Airpay params for subscription payment
    This endpoint is called by Next.js frontend to initiate payment
    """
    try:
        data = request.get_json()
        print(f"\n{'='*60}")
        print(f"[PAYMENT HASH DEBUG] Received request")
        print(f"{'='*60}")

        if not data:
            print("[PAYMENT HASH DEBUG] ERROR: No data provided")
            return jsonify({"error": "No data provided"}), 400

        print(f"[PAYMENT HASH DEBUG] Request data: {data}")

        required_fields = ['txnid', 'amount', 'productinfo', 'firstname', 'email']
        if not all(field in data for field in required_fields):
            missing = [f for f in required_fields if f not in data]
            print(f"[PAYMENT HASH DEBUG] ERROR: Missing required fields: {missing}")
            return jsonify({"error": "Missing required fields"}), 400

        # Get selected gateway (default to PayU for backward compatibility)
        gateway = data.get('gateway', 'payu').lower()
        print(f"[PAYMENT HASH DEBUG] Selected gateway: {gateway}")

        if gateway == 'sabpaisa':
            # SabPaisa payment gateway
            # Build parameter string with optional UDF fields
            udf_params = {}
            for i in range(1, 6):
                udf_key = f'udf{i}'
                if udf_key in data:
                    udf_params[udf_key] = data[udf_key]

            # Sanitize payer name to remove special characters
            sanitized_name = sanitize_payer_name(data['firstname'])

            # Build parameter string (clientCode must be in BOTH encData AND as separate form field)
            params_str = build_payment_request(
                payer_name=sanitized_name,
                payer_email=data['email'],
                payer_mobile=data.get('phone', '0000000000'),
                client_txn_id=data['txnid'],
                amount=float(data['amount']),
                client_code=current_app.config['SABPAISA_CLIENT_CODE'],
                trans_username=current_app.config['SABPAISA_USERNAME'],
                trans_password=current_app.config['SABPAISA_PASSWORD'],
                callback_url=data.get('surl', ''),
                **udf_params
            )

            # Encrypt the request
            enc_data = create_encrypted_request(
                params_str,
                current_app.config['SABPAISA_AUTH_KEY'],
                current_app.config['SABPAISA_AUTH_IV']
            )

            return jsonify({
                'gateway': 'sabpaisa',
                'sabpaisa_url': current_app.config['SABPAISA_BASE_URL'],
                'encData': enc_data,
                'clientCode': current_app.config['SABPAISA_CLIENT_CODE']
            }), 200
        elif gateway == 'airpay':
            # Airpay V4 payment gateway
            print(f"[PAYMENT HASH DEBUG] Processing Airpay V4 payment")
            print(f"[PAYMENT HASH DEBUG] Airpay config check:")
            print(f"  MERCHANT_ID: {current_app.config.get('AIRPAY_MERCHANT_ID', 'NOT SET')}")
            print(f"  USERNAME: {current_app.config.get('AIRPAY_USERNAME', 'NOT SET')}")
            print(f"  PASSWORD: {'SET' if current_app.config.get('AIRPAY_PASSWORD') else 'NOT SET'}")
            print(f"  SECRET_KEY: {'SET' if current_app.config.get('AIRPAY_SECRET_KEY') else 'NOT SET'}")
            print(f"  CLIENT_ID: {'SET' if current_app.config.get('AIRPAY_CLIENT_ID') else 'NOT SET'}")
            print(f"  CLIENT_SECRET: {'SET' if current_app.config.get('AIRPAY_CLIENT_SECRET') else 'NOT SET'}")
            print(f"  BASE_URL: {current_app.config.get('AIRPAY_BASE_URL', 'NOT SET')}")

            # Split buyer name into first and last name (sanitized for Airpay)
            buyer_first_name, buyer_last_name = split_name_for_airpay(data['firstname'])

            print(f"[PAYMENT HASH DEBUG] Name split: '{data['firstname']}' -> first='{buyer_first_name}', last='{buyer_last_name}'")

            # Build Airpay V4 payment request for subscription with OAuth2
            # Note: For subscription payments, we don't have real user address data
            # Using test/placeholder data that meets Airpay minimum requirements
            # This is acceptable for digital subscription payments

            # Get phone number from request
            # IMPORTANT: Frontend should send 'phone' in the request for Airpay
            buyer_phone = data.get('phone', '')

            # If no phone provided, use a fallback
            # Note: Airpay requires valid Indian mobile format (10 digits, starts with 6-9)
            if not buyer_phone or len(str(buyer_phone).strip()) == 0:
                # Use a valid but generic number
                # Airpay may reject obvious test patterns like 9999999999, 1111111111, etc.
                buyer_phone = '7012345678'  # Generic valid format
                print(f"[PAYMENT HASH DEBUG] WARNING: No phone provided, using placeholder: {buyer_phone}")
            else:
                print(f"[PAYMENT HASH DEBUG] Phone number provided: {buyer_phone}")

            print(f"[PAYMENT HASH DEBUG] Calling build_airpay_request...")

            airpay_params = build_airpay_request(
                buyer_email=data['email'],
                buyer_first_name=buyer_first_name,
                buyer_last_name=buyer_last_name,
                buyer_phone=buyer_phone,
                buyer_address='Subscription Service',  # Min 4 chars required by Airpay
                buyer_city='Mumbai',  # Min 2 chars required
                buyer_state='Maharashtra',  # Min 2 chars required
                buyer_country='India',  # Min 2 chars required
                buyer_pincode='400001',  # Valid 6-digit pincode
                amount=f"{float(data['amount']):.2f}",
                order_id=data['txnid'],
                currency='356',  # INR currency code
                iso_currency='INR',
                merchant_id=current_app.config['AIRPAY_MERCHANT_ID'],
                username=current_app.config['AIRPAY_USERNAME'],
                password=current_app.config['AIRPAY_PASSWORD'],
                secret_key=current_app.config['AIRPAY_SECRET_KEY'],
                client_id=current_app.config['AIRPAY_CLIENT_ID'],
                client_secret=current_app.config['AIRPAY_CLIENT_SECRET'],
            )

            print(f"[PAYMENT HASH DEBUG] Airpay params generated successfully")
            print(f"[PAYMENT HASH DEBUG] Params keys: {list(airpay_params.keys())}")

            airpay_params['gateway'] = 'airpay'

            print(f"[PAYMENT HASH DEBUG] Returning Airpay params to frontend")
            return jsonify(airpay_params), 200
        else:
            # PayU payment gateway (default)
            # Prepare PayU parameters
            payu_params = {
                'key': current_app.config['PAYU_KEY'],
                'txnid': data['txnid'],
                'amount': str(data['amount']),
                'productinfo': data['productinfo'],
                'firstname': data['firstname'],
                'email': data['email'],
            }

            # Include UDF fields if provided (for inquiry payments)
            for i in range(1, 11):
                udf_key = f'udf{i}'
                if udf_key in data:
                    payu_params[udf_key] = data[udf_key]

            # Generate hash
            payment_hash = generate_hash(payu_params, current_app.config['PAYU_SALT'])

            return jsonify({
                'gateway': 'payu',
                'hash': payment_hash,
                'merchantKey': current_app.config['PAYU_KEY'],
                'payuUrl': 'https://secure.payu.in/_payment'  # Production URL
            }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to generate hash: {str(e)}"}), 500


@payments_bp.route('/subscription-success', methods=['POST'])
def subscription_payment_success():
    """
    Handle successful subscription payment callback from PayU
    This is called by PayU after successful payment
    """
    payu_data = request.form.to_dict()

    try:
        # Verify hash
        received_hash = payu_data.get('hash', '')
        calculated_hash = verify_hash(payu_data, current_app.config['PAYU_SALT'])

        if received_hash != calculated_hash:
            return redirect('https://mandi2mandi.com/payment/failed?reason=invalid_hash')

        # Payment is verified - redirect to Next.js success handler
        # The Next.js success route will call the update-subscription endpoint
        return redirect(
            f'https://mandi2mandi.com/api/payment/success?'
            f'txnid={payu_data.get("txnid")}&'
            f'mihpayid={payu_data.get("mihpayid")}&'
            f'amount={payu_data.get("amount")}&'
            f'status=success'
        )

    except Exception as e:
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


@payments_bp.route('/subscription-failure', methods=['POST'])
def subscription_payment_failure():
    """
    Handle failed subscription payment callback from PayU
    """
    payu_data = request.form.to_dict()

    try:
        txnid = payu_data.get('txnid', '')
        return redirect(f'https://mandi2mandi.com/payment/failed?txnid={txnid}')

    except Exception as e:
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


# ============================================
# INQUIRY PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/inquiry-payment-success', methods=['POST'])
def inquiry_payment_success():
    """
    Handle successful inquiry payment callback from PayU
    Creates an Order from the Inquiry after successful payment
    """
    payu_data = request.form.to_dict()

    try:
        # Verify hash
        received_hash = payu_data.get('hash', '')
        calculated_hash = verify_hash(payu_data, current_app.config['PAYU_SALT'])

        if received_hash != calculated_hash:
            return redirect('https://mandi2mandi.com/payment/failed?reason=invalid_hash')

        # Get inquiry ID from UDF field
        inquiry_id = payu_data.get('udf1')

        if not inquiry_id:
            return redirect('https://mandi2mandi.com/payment/failed?reason=no_inquiry_id')

        # Get the inquiry
        inquiry = Inquiry.query.get(int(inquiry_id))

        if not inquiry:
            return redirect('https://mandi2mandi.com/payment/failed?reason=inquiry_not_found')

        # Create Order from Inquiry
        new_order = Order(
            user_id=inquiry.buyer_id,
            product_name=inquiry.product_name,
            quantity=inquiry.quantity,
            unit=inquiry.unit,
            total_price=inquiry.estimated_price,
            amount_paid=float(payu_data.get('amount')),
            payment_option='Online',
            utr_code=payu_data.get('mihpayid'),
            status='Booked',
            buyer_name=inquiry.buyer_name,
            buyer_mobile=inquiry.mobile,
            address_line_1=inquiry.address_line_1,
            address_line_2=inquiry.address_line_2,
            city=inquiry.city,
            state=inquiry.state,
            pincode=inquiry.pincode
        )

        db.session.add(new_order)
        inquiry.status = 'Paid'
        db.session.commit()

        return redirect(f'https://mandi2mandi.com/confirmation?status=success&order_id={new_order.id}&inquiry_id={inquiry_id}')

    except Exception as e:
        db.session.rollback()
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


@payments_bp.route('/inquiry-payment-failure', methods=['POST'])
def inquiry_payment_failure():
    """
    Handle failed inquiry payment callback from PayU
    """
    payu_data = request.form.to_dict()

    try:
        inquiry_id = payu_data.get('udf1', '')
        txnid = payu_data.get('txnid', '')
        return redirect(f'https://mandi2mandi.com/payment/failed?txnid={txnid}&inquiry_id={inquiry_id}')

    except Exception as e:
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


# ============================================
# SABPAISA SUBSCRIPTION PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/sabpaisa-subscription-success', methods=['POST'])
def sabpaisa_subscription_payment_success():
    """
    Handle successful subscription payment callback from SabPaisa
    """
    try:
        # Get encrypted response from SabPaisa
        enc_data = request.form.get('encData')

        if not enc_data:
            return redirect('https://mandi2mandi.com/payment/failed?reason=no_encrypted_data')

        # Decrypt and parse the response
        response_data = parse_callback_response(
            enc_data,
            current_app.config['SABPAISA_AUTH_KEY'],
            current_app.config['SABPAISA_AUTH_IV']
        )

        # Check if payment was successful (SabPaisa returns status as 'SUCCESS')
        payment_status = response_data.get('status', '').upper()
        if payment_status != 'SUCCESS':
            return redirect(f'https://mandi2mandi.com/payment/failed?reason={response_data.get("statusMessage", "payment_failed")}')

        # Get transaction ID
        txnid = response_data.get('clientTxnId', '')
        sabpaisa_txn_id = response_data.get('sabpaisaTxnId', txnid)

        # Payment is verified - redirect to Next.js success handler
        return redirect(
            f'https://mandi2mandi.com/api/payment/success?'
            f'txnid={txnid}&'
            f'mihpayid={sabpaisa_txn_id}&'
            f'amount={response_data.get("amount", "199.00")}&'
            f'status=success'
        )

    except Exception as e:
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


@payments_bp.route('/sabpaisa-subscription-failure', methods=['POST'])
def sabpaisa_subscription_payment_failure():
    """
    Handle failed subscription payment callback from SabPaisa
    """
    try:
        # Get encrypted response from SabPaisa
        enc_data = request.form.get('encData')

        if enc_data:
            # Decrypt the response to get details
            response_data = parse_callback_response(
                enc_data,
                current_app.config['SABPAISA_AUTH_KEY'],
                current_app.config['SABPAISA_AUTH_IV']
            )
            txnid = response_data.get('clientTxnId', '')
        else:
            txnid = request.form.get('txnId', '')

        return redirect(f'https://mandi2mandi.com/payment/failed?txnid={txnid}')

    except Exception as e:
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


# ============================================
# SABPAISA PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/sabpaisa-payment-success', methods=['POST'])
def sabpaisa_payment_success():
    """Handle successful payment callback from SabPaisa"""
    try:
        # Get encrypted response from SabPaisa
        enc_data = request.form.get('encData')

        if not enc_data:
            return redirect('https://mandi2mandi.com/confirmation?status=error&message=No+encrypted+data+received')

        # Decrypt and parse the response
        response_data = parse_callback_response(
            enc_data,
            current_app.config['SABPAISA_AUTH_KEY'],
            current_app.config['SABPAISA_AUTH_IV']
        )

        # Check if payment was successful (SabPaisa returns status as 'SUCCESS')
        payment_status = response_data.get('status', '').upper()
        if payment_status != 'SUCCESS':
            return redirect(f'https://mandi2mandi.com/confirmation?status=failed&message={response_data.get("statusMessage", "Payment+failed")}')

        # Get transaction ID
        txnid = response_data.get('clientTxnId', '')

        # Update order status
        order = Order.query.filter_by(utr_code=txnid).first()

        if order:
            order.status = 'Booked'
            # Use SabPaisa transaction reference as UTR
            order.utr_code = response_data.get('sabpaisaTxnId', txnid)
            db.session.commit()

        return redirect(f'https://mandi2mandi.com/confirmation?status=success&txnid={txnid}')
    except Exception as e:
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')


@payments_bp.route('/sabpaisa-payment-failure', methods=['POST'])
def sabpaisa_payment_failure():
    """Handle failed payment callback from SabPaisa"""
    try:
        # Get encrypted response from SabPaisa
        enc_data = request.form.get('encData')

        if enc_data:
            # Decrypt the response to get details
            response_data = parse_callback_response(
                enc_data,
                current_app.config['SABPAISA_AUTH_KEY'],
                current_app.config['SABPAISA_AUTH_IV']
            )
            txnid = response_data.get('clientTxnId', '')
        else:
            txnid = request.form.get('txnId', '')

        # Update order status
        order = Order.query.filter_by(utr_code=txnid).first()

        if order:
            order.status = 'Failed'
            db.session.commit()

        return redirect(f'https://mandi2mandi.com/confirmation?status=failed&txnid={txnid}')
    except Exception as e:
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')


# ============================================
# AIRPAY PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/airpay-payment-success', methods=['POST'])
def airpay_payment_success():
    """Handle successful payment callback from Airpay V4"""
    try:
        # Get form data from Airpay V4 (contains encrypted 'response' field)
        airpay_data = request.form.to_dict()

        print(f"[AIRPAY V4 DEBUG] Callback received: {list(airpay_data.keys())}")

        # Validate and decrypt the callback response
        validation_result = validate_airpay_response(
            airpay_data,
            current_app.config['AIRPAY_MERCHANT_ID'],
            current_app.config['AIRPAY_USERNAME'],
            current_app.config['AIRPAY_PASSWORD']
        )

        if not validation_result['valid']:
            error_msg = validation_result.get('error', 'Invalid response')
            print(f"[AIRPAY V4 ERROR] Validation failed: {error_msg}")
            return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={error_msg}')

        # Check transaction status (200 = SUCCESS in Airpay)
        transaction_status = validation_result['status']
        txnid = validation_result['transaction_id']

        if transaction_status == '200':
            # Update order status
            order = Order.query.filter_by(utr_code=txnid).first()

            if order:
                order.status = 'Booked'
                order.utr_code = validation_result['ap_transaction_id']  # Update with Airpay transaction ID
                db.session.commit()

            print(f"[AIRPAY V4 DEBUG] Payment successful for txnid: {txnid}")
            return redirect(f'https://mandi2mandi.com/confirmation?status=success&txnid={txnid}')
        else:
            # Payment failed but callback received
            order = Order.query.filter_by(utr_code=txnid).first()

            if order:
                order.status = 'Failed'
                db.session.commit()

            message = validation_result.get('message', 'Payment failed')
            print(f"[AIRPAY V4 DEBUG] Payment failed: {message}")
            return redirect(f'https://mandi2mandi.com/confirmation?status=failed&txnid={txnid}&message={message}')

    except Exception as e:
        print(f"[AIRPAY V4 ERROR] Exception: {str(e)}")
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')


@payments_bp.route('/airpay-payment-failure', methods=['POST'])
def airpay_payment_failure():
    """Handle failed payment callback from Airpay V4"""
    try:
        # Get form data from Airpay V4
        airpay_data = request.form.to_dict()

        print(f"[AIRPAY V4 DEBUG] Failure callback received: {list(airpay_data.keys())}")

        # Try to decrypt and get transaction ID
        txnid = ''
        try:
            if 'response' in airpay_data:
                validation_result = validate_airpay_response(
                    airpay_data,
                    current_app.config['AIRPAY_MERCHANT_ID'],
                    current_app.config['AIRPAY_USERNAME'],
                    current_app.config['AIRPAY_PASSWORD']
                )
                if validation_result.get('transaction_id'):
                    txnid = validation_result['transaction_id']
        except:
            pass

        if txnid:
            # Update order status
            order = Order.query.filter_by(utr_code=txnid).first()

            if order:
                order.status = 'Failed'
                db.session.commit()

        return redirect(f'https://mandi2mandi.com/confirmation?status=failed&txnid={txnid}')

    except Exception as e:
        print(f"[AIRPAY V4 ERROR] Failure exception: {str(e)}")
        return redirect(f'https://mandi2mandi.com/confirmation?status=error&message={str(e)}')


# ============================================
# AIRPAY SUBSCRIPTION PAYMENT ENDPOINTS
# ============================================

@payments_bp.route('/airpay-subscription-success', methods=['POST'])
def airpay_subscription_payment_success():
    """Handle successful subscription payment callback from Airpay V4"""
    try:
        # Get form data from Airpay V4 (contains encrypted 'response' field)
        airpay_data = request.form.to_dict()

        print(f"[AIRPAY V4 SUBSCRIPTION DEBUG] Callback received: {list(airpay_data.keys())}")

        # Validate and decrypt the callback response
        validation_result = validate_airpay_response(
            airpay_data,
            current_app.config['AIRPAY_MERCHANT_ID'],
            current_app.config['AIRPAY_USERNAME'],
            current_app.config['AIRPAY_PASSWORD']
        )

        if not validation_result['valid']:
            error_msg = validation_result.get('error', 'Invalid response')
            print(f"[AIRPAY V4 SUBSCRIPTION ERROR] Validation failed: {error_msg}")
            return redirect(f'https://mandi2mandi.com/payment/failed?reason={error_msg}')

        # Check transaction status (200 = SUCCESS in Airpay)
        transaction_status = validation_result['status']
        txnid = validation_result['transaction_id']
        ap_txn_id = validation_result['ap_transaction_id']

        if transaction_status == '200':
            print(f"[AIRPAY V4 SUBSCRIPTION DEBUG] Payment successful for txnid: {txnid}")
            # Payment is verified - redirect to Next.js success handler
            return redirect(
                f'https://mandi2mandi.com/api/payment/success?'
                f'txnid={txnid}&'
                f'mihpayid={ap_txn_id}&'
                f'amount={validation_result.get("amount", "199.00")}&'
                f'status=success'
            )
        else:
            # Payment failed but callback received
            message = validation_result.get('message', 'Payment failed')
            print(f"[AIRPAY V4 SUBSCRIPTION DEBUG] Payment failed: {message}")
            return redirect(f'https://mandi2mandi.com/payment/failed?txnid={txnid}&message={message}')

    except Exception as e:
        print(f"[AIRPAY V4 SUBSCRIPTION ERROR] Exception: {str(e)}")
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')


@payments_bp.route('/airpay-subscription-failure', methods=['POST'])
def airpay_subscription_payment_failure():
    """Handle failed subscription payment callback from Airpay V4"""
    try:
        # Get form data from Airpay V4
        airpay_data = request.form.to_dict()

        print(f"[AIRPAY V4 SUBSCRIPTION DEBUG] Failure callback received: {list(airpay_data.keys())}")

        # Try to decrypt and get transaction ID
        txnid = ''
        try:
            if 'response' in airpay_data:
                validation_result = validate_airpay_response(
                    airpay_data,
                    current_app.config['AIRPAY_MERCHANT_ID'],
                    current_app.config['AIRPAY_USERNAME'],
                    current_app.config['AIRPAY_PASSWORD']
                )
                if validation_result.get('transaction_id'):
                    txnid = validation_result['transaction_id']
        except:
            pass

        return redirect(f'https://mandi2mandi.com/payment/failed?txnid={txnid}')

    except Exception as e:
        print(f"[AIRPAY V4 SUBSCRIPTION ERROR] Failure exception: {str(e)}")
        return redirect(f'https://mandi2mandi.com/payment/failed?reason={str(e)}')