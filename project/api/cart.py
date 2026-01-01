"""
Cart API endpoints
Handles shopping cart operations: add, update, remove, get cart
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from . import db
from .models import Cart, CartItem

cart_bp = Blueprint('cart', __name__)

MINIMUM_QUANTITY = 2000

@cart_bp.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    """Get current user's cart with all items"""
    try:
        cart = Cart.query.filter_by(user_id=current_user.id).first()

        if not cart:
            # Create empty cart if doesn't exist
            cart = Cart(user_id=current_user.id)
            db.session.add(cart)
            db.session.commit()

        return jsonify({
            'success': True,
            'cart': cart.to_json()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching cart: {str(e)}'
        }), 500


@cart_bp.route('/api/cart/add', methods=['POST'])
@login_required
def add_to_cart():
    """Add item to cart or update quantity if already exists"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['productId', 'productName', 'pricePerUnit', 'unit', 'quantity']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        quantity = float(data['quantity'])

        # Validate minimum quantity
        if quantity < MINIMUM_QUANTITY:
            return jsonify({
                'success': False,
                'message': f'Minimum purchase quantity is {MINIMUM_QUANTITY} {data["unit"]}'
            }), 400

        # Get or create cart
        cart = Cart.query.filter_by(user_id=current_user.id).first()
        if not cart:
            cart = Cart(user_id=current_user.id)
            db.session.add(cart)
            db.session.commit()

        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=data['productId']
        ).first()

        if existing_item:
            # Update quantity
            existing_item.quantity = quantity
            message = 'Cart item updated successfully'
        else:
            # Add new item
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=data['productId'],
                product_name=data['productName'],
                price_per_unit=float(data['pricePerUnit']),
                unit=data['unit'],
                quantity=quantity,
                image_url=data.get('imageUrl'),
                seller_name=data.get('sellerName'),
                location=data.get('location')
            )
            db.session.add(cart_item)
            message = 'Item added to cart successfully'

        db.session.commit()

        # Refresh cart to get updated data
        db.session.refresh(cart)

        return jsonify({
            'success': True,
            'message': message,
            'cart': cart.to_json()
        }), 200

    except ValueError as e:
        return jsonify({
            'success': False,
            'message': 'Invalid quantity value'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error adding to cart: {str(e)}'
        }), 500


@cart_bp.route('/api/cart/update/<int:item_id>', methods=['PUT'])
@login_required
def update_cart_item(item_id):
    """Update quantity of a cart item"""
    try:
        data = request.get_json()

        if 'quantity' not in data:
            return jsonify({
                'success': False,
                'message': 'Quantity is required'
            }), 400

        quantity = float(data['quantity'])

        # Get cart item
        cart_item = CartItem.query.get(item_id)

        if not cart_item:
            return jsonify({
                'success': False,
                'message': 'Cart item not found'
            }), 404

        # Verify ownership
        if cart_item.cart.user_id != current_user.id:
            return jsonify({
                'success': False,
                'message': 'Unauthorized access'
            }), 403

        # Validate minimum quantity
        if quantity < MINIMUM_QUANTITY:
            return jsonify({
                'success': False,
                'message': f'Minimum purchase quantity is {MINIMUM_QUANTITY} {cart_item.unit}'
            }), 400

        cart_item.quantity = quantity
        db.session.commit()

        # Refresh cart to get updated data
        cart = cart_item.cart
        db.session.refresh(cart)

        return jsonify({
            'success': True,
            'message': 'Cart item updated successfully',
            'cart': cart.to_json()
        }), 200

    except ValueError as e:
        return jsonify({
            'success': False,
            'message': 'Invalid quantity value'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating cart item: {str(e)}'
        }), 500


@cart_bp.route('/api/cart/remove/<int:item_id>', methods=['DELETE'])
@login_required
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        cart_item = CartItem.query.get(item_id)

        if not cart_item:
            return jsonify({
                'success': False,
                'message': 'Cart item not found'
            }), 404

        # Verify ownership
        if cart_item.cart.user_id != current_user.id:
            return jsonify({
                'success': False,
                'message': 'Unauthorized access'
            }), 403

        cart = cart_item.cart
        db.session.delete(cart_item)
        db.session.commit()

        # Refresh cart to get updated data
        db.session.refresh(cart)

        return jsonify({
            'success': True,
            'message': 'Item removed from cart successfully',
            'cart': cart.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error removing item: {str(e)}'
        }), 500


@cart_bp.route('/api/cart/clear', methods=['DELETE'])
@login_required
def clear_cart():
    """Clear all items from cart"""
    try:
        cart = Cart.query.filter_by(user_id=current_user.id).first()

        if not cart:
            return jsonify({
                'success': False,
                'message': 'Cart not found'
            }), 404

        # Delete all cart items
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

        # Refresh cart to get updated data
        db.session.refresh(cart)

        return jsonify({
            'success': True,
            'message': 'Cart cleared successfully',
            'cart': cart.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error clearing cart: {str(e)}'
        }), 500


@cart_bp.route('/api/cart/count', methods=['GET'])
@login_required
def get_cart_count():
    """Get total number of items in cart (for badge display)"""
    try:
        cart = Cart.query.filter_by(user_id=current_user.id).first()

        if not cart:
            return jsonify({
                'success': True,
                'count': 0
            }), 200

        return jsonify({
            'success': True,
            'count': len(cart.items)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching cart count: {str(e)}'
        }), 500
