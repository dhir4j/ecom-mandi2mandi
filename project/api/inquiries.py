from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from . import db
from .models import Inquiry, ChatMessage
import datetime

inquiries_bp = Blueprint('inquiries', __name__)

@inquiries_bp.route('/submit', methods=['POST'])
@login_required
def submit_inquiry():
    """Submit a new inquiry"""
    try:
        data = request.get_json()

        required_fields = [
            'productId', 'productName', 'sellerId', 'sellerName',
            'quantity', 'unit', 'estimatedPrice', 'pricePerUnit',
            'addressLine1', 'city', 'state', 'pincode', 'mobile'
        ]

        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create new inquiry
        inquiry = Inquiry(
            product_id=data['productId'],
            product_name=data['productName'],
            seller_id=data['sellerId'],
            seller_name=data['sellerName'],
            buyer_id=current_user.id,
            buyer_name=current_user.name,
            quantity=float(data['quantity']),
            unit=data['unit'],
            estimated_price=float(data['estimatedPrice']),
            price_per_unit=float(data['pricePerUnit']),
            address_line_1=data['addressLine1'],
            address_line_2=data.get('addressLine2', ''),
            city=data['city'],
            state=data['state'],
            pincode=data['pincode'],
            mobile=data['mobile'],
            additional_notes=data.get('additionalNotes', ''),
            status='Pending'
        )

        db.session.add(inquiry)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Inquiry submitted successfully',
            'inquiry': inquiry.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to submit inquiry: {str(e)}'}), 500


@inquiries_bp.route('/my-inquiries', methods=['GET'])
@login_required
def get_my_inquiries():
    """Get all inquiries for the current user (buyer)"""
    try:
        inquiries = Inquiry.query.filter_by(buyer_id=current_user.id).order_by(Inquiry.created_on.desc()).all()
        return jsonify({
            'inquiries': [inquiry.to_json() for inquiry in inquiries]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch inquiries: {str(e)}'}), 500


@inquiries_bp.route('/seller-inquiries', methods=['GET'])
@login_required
def get_seller_inquiries():
    """Get all inquiries for the current user (seller/trader)"""
    try:
        inquiries = Inquiry.query.filter_by(seller_id=current_user.id).order_by(Inquiry.created_on.desc()).all()
        return jsonify({
            'inquiries': [inquiry.to_json() for inquiry in inquiries]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch inquiries: {str(e)}'}), 500


@inquiries_bp.route('/<int:inquiry_id>', methods=['GET'])
@login_required
def get_inquiry(inquiry_id):
    """Get a specific inquiry by ID"""
    try:
        inquiry = Inquiry.query.get(inquiry_id)

        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Check if user is authorized to view this inquiry
        if inquiry.buyer_id != current_user.id and inquiry.seller_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        return jsonify({
            'inquiry': inquiry.to_json()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch inquiry: {str(e)}'}), 500


@inquiries_bp.route('/<int:inquiry_id>/approve', methods=['POST'])
@login_required
def approve_inquiry(inquiry_id):
    """Approve an inquiry with shipping charges (seller or admin only)"""
    try:
        inquiry = Inquiry.query.get(inquiry_id)

        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Check if user is authorized to approve
        if inquiry.seller_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        # Get shipping data from request
        data = request.get_json()

        # Validate shipping rate is provided (mandatory)
        if not data or 'shippingRatePerKg' not in data:
            return jsonify({'error': 'Shipping rate per kg is required for approval'}), 400

        shipping_rate_per_kg = float(data['shippingRatePerKg'])

        if shipping_rate_per_kg <= 0:
            return jsonify({'error': 'Shipping rate must be greater than 0'}), 400

        # Get shipping charge and final total from request
        shipping_charge = float(data.get('shippingCharge', 0))
        final_total = float(data.get('finalTotal', inquiry.estimated_price + shipping_charge))

        # Update inquiry with approval and shipping data
        inquiry.status = 'Approved'
        inquiry.responded_on = datetime.datetime.now()
        inquiry.shipping_rate_per_kg = shipping_rate_per_kg
        inquiry.shipping_charge = shipping_charge
        inquiry.final_total = final_total

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Inquiry approved successfully with shipping charges',
            'inquiry': inquiry.to_json()
        }), 200
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': 'Invalid numeric value provided'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to approve inquiry: {str(e)}'}), 500


@inquiries_bp.route('/<int:inquiry_id>/reject', methods=['POST'])
@login_required
def reject_inquiry(inquiry_id):
    """Reject an inquiry (seller or admin only)"""
    try:
        inquiry = Inquiry.query.get(inquiry_id)

        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Check if user is authorized to reject
        if inquiry.seller_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        inquiry.status = 'Rejected'
        inquiry.responded_on = datetime.datetime.now()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Inquiry rejected',
            'inquiry': inquiry.to_json()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to reject inquiry: {str(e)}'}), 500


# ============================================
# CHAT MESSAGE ENDPOINTS
# ============================================

@inquiries_bp.route('/<int:inquiry_id>/messages', methods=['GET'])
@login_required
def get_messages(inquiry_id):
    """Get all chat messages for an inquiry"""
    try:
        inquiry = Inquiry.query.get(inquiry_id)

        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Check if user is authorized to view messages
        if inquiry.buyer_id != current_user.id and inquiry.seller_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        messages = ChatMessage.query.filter_by(inquiry_id=inquiry_id).order_by(ChatMessage.created_on.asc()).all()

        # Mark messages as read if user is not the sender
        for message in messages:
            if message.sender_id != current_user.id and not message.is_read:
                message.is_read = True

        db.session.commit()

        return jsonify({
            'messages': [message.to_json() for message in messages]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch messages: {str(e)}'}), 500


@inquiries_bp.route('/<int:inquiry_id>/messages', methods=['POST'])
@login_required
def send_message(inquiry_id):
    """Send a chat message for an inquiry"""
    try:
        inquiry = Inquiry.query.get(inquiry_id)

        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Check if user is authorized to send messages
        if inquiry.buyer_id != current_user.id and inquiry.seller_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400

        # Determine sender name and role
        # If admin is sending, show as seller to maintain seller identity
        if current_user.role == 'admin':
            sender_name = inquiry.seller_name
            sender_role = 'seller'
        else:
            sender_name = current_user.name
            sender_role = current_user.role

        # Create new chat message
        chat_message = ChatMessage(
            inquiry_id=inquiry_id,
            sender_id=current_user.id,
            sender_name=sender_name,
            sender_role=sender_role,
            message=data['message'],
            is_read=False
        )

        db.session.add(chat_message)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Message sent successfully',
            'chatMessage': chat_message.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to send message: {str(e)}'}), 500
