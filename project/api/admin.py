from functools import wraps
from flask import Blueprint, jsonify, request, Response
from flask_login import login_required, current_user
from .models import Order, Product, User
from . import db
import csv
import io

admin_bp = Blueprint('admin', __name__)

# Decorator to check for admin role
def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    """Admin endpoint to view all orders with filtering."""
    status_filter = request.args.get('status')
    
    query = Order.query
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
        
    orders = query.order_by(Order.ordered_on.desc()).all()
    return jsonify([order.to_json(with_buyer=True) for order in orders])

@admin_bp.route('/orders/download', methods=['GET'])
@admin_required
def download_orders_csv():
    """Admin endpoint to download all orders as a CSV file."""
    orders = Order.query.order_by(Order.ordered_on.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    header = [
        'Order ID', 'Date', 'Buyer Name', 'Buyer Email', 'Product Name', 
        'Quantity', 'Unit', 'Total Price', 'Amount Paid', 'Payment Option',
        'Transaction ID', 'Status', 'Address Line 1', 'Address Line 2',
        'City', 'State', 'Pincode'
    ]
    writer.writerow(header)
    
    # Write data
    for order in orders:
        row = [
            f"ORD{order.id:06d}",
            order.ordered_on.strftime('%Y-%m-%d %H:%M:%S'),
            order.buyer.name,
            order.buyer.email,
            order.product_name,
            order.quantity,
            order.unit,
            order.total_price,
            order.amount_paid,
            order.payment_option,
            order.utr_code,
            order.status,
            order.address_line_1,
            order.address_line_2,
            order.city,
            order.state,
            order.pincode
        ]
        writer.writerow(row)
        
    output.seek(0)
    
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=mandi2mandi_orders.csv"}
    )

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    """Admin endpoint to update an order's status."""
    data = request.get_json()
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
        
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
        
    order.status = new_status
    db.session.commit()
    
    return jsonify({"message": f"Order {order_id} status updated to {new_status}"}), 200

@admin_bp.route('/products/pending', methods=['GET'])
@admin_required
def get_pending_products():
    """Admin endpoint to get all products with 'Pending' status."""
    pending_products = Product.query.filter_by(status='Pending').order_by(Product.created_on.desc()).all()
    return jsonify([product.to_json(with_seller=True) for product in pending_products])

@admin_bp.route('/products/<int:product_id>/status', methods=['PUT'])
@admin_required
def update_product_status(product_id):
    """Admin endpoint to approve or reject a product."""
    data = request.get_json()
    new_status = data.get('status')

    if not new_status or new_status not in ['Active', 'Rejected']:
        return jsonify({"error": "Invalid status provided. Must be 'Active' or 'Rejected'."}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
        
    product.status = new_status
    db.session.commit()
    
    return jsonify({"message": f"Product {product_id} status updated to {new_status}"}), 200
