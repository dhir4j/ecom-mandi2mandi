from flask import Blueprint, request, jsonify
from .models import User
from . import db
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'buyer')

    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User with this email already exists"}), 409

    if role not in ['trader', 'buyer', 'admin']:
        return jsonify({"error": "Invalid role specified"}), 400

    new_user = User(name=name, email=email, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully."}), 201


@auth_bp.route('/login', methods=['POST'], strict_slashes=False)
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        login_user(user, remember=True)
        return jsonify({
            "message": "Login successful",
            "user": user.to_json()
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route('/logout', methods=['POST'], strict_slashes=False)
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Successfully logged out."}), 200


@auth_bp.route('/status', methods=['GET'], strict_slashes=False)
def status():
    if current_user.is_authenticated:
        return jsonify({
            "logged_in": True,
            "user": current_user.to_json()
        }), 200
    else:
        return jsonify({"logged_in": False}), 200


@auth_bp.route('/update-subscription', methods=['POST'], strict_slashes=False)
@login_required
def update_subscription():
    """
    Update user's subscription status after successful payment
    Expected JSON payload:
    {
        "txnid": "transaction_id_from_payu",
        "mihpayid": "payu_payment_id",
        "amount": "199.00",
        "hasSubscription": true,
        "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        txnid = data.get('txnid')
        mihpayid = data.get('mihpayid')
        amount = data.get('amount')
        has_subscription = data.get('hasSubscription', True)
        subscription_expiry = data.get('subscriptionExpiry')

        if not all([txnid, mihpayid, amount, subscription_expiry]):
            return jsonify({"error": "Missing required fields"}), 400

        # Update current user's subscription
        current_user.has_subscription = has_subscription
        current_user.subscription_txn_id = txnid
        current_user.subscription_payu_id = mihpayid
        current_user.subscription_amount = float(amount) if isinstance(amount, str) else amount

        # Parse subscription expiry date
        try:
            if isinstance(subscription_expiry, str):
                # Handle ISO format date string
                current_user.subscription_expiry = datetime.fromisoformat(subscription_expiry.replace('Z', '+00:00'))
            else:
                current_user.subscription_expiry = subscription_expiry
        except ValueError as e:
            return jsonify({"error": f"Invalid date format: {str(e)}"}), 400

        # Commit changes to database
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Subscription updated successfully",
            "user": current_user.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update subscription: {str(e)}"}), 500
