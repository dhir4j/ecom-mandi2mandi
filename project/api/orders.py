from flask import Blueprint, request, jsonify
from .models import Order
from . import db
from flask_login import login_required, current_user

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/my-orders', methods=['GET'])
@login_required
def get_my_orders():
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.ordered_on.desc()).all()
    return jsonify([o.to_json() for o in orders]), 200

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@login_required
def get_order_details(order_id):
    order = Order.query.filter_by(id=order_id, user_id=current_user.id).first()
    if not order:
        return jsonify({"error": "Order not found or access denied"}), 404
    return jsonify(order.to_invoice_json()), 200


@orders_bp.route('/orders', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    
    # Updated to handle structured address
    required_fields = [
        'productName', 'quantity', 'unit', 'totalPrice', 'amountToPay', 
        'paymentOption', 'utr', 'buyerName', 'mobile',
        'pincode', 'addressLine1', 'city', 'state'
    ]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        new_order = Order(
            user_id=current_user.id,
            product_name=data['productName'],
            quantity=float(data['quantity']),
            unit=data['unit'],
            total_price=float(data['totalPrice']),
            amount_paid=float(data['amountToPay']),
            payment_option=data['paymentOption'],
            utr_code=data['utr'],
            buyer_name=data['buyerName'],
            buyer_mobile=data['mobile'],
            pincode=data['pincode'],
            address_line_1=data['addressLine1'],
            address_line_2=data.get('addressLine2', ''), # Optional field
            city=data['city'],
            state=data['state']
        )
        db.session.add(new_order)
        db.session.commit()
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return jsonify({"error": "Invalid data format"}), 400


    return jsonify({"message": "Order created successfully", "order": new_order.to_json()}), 201
