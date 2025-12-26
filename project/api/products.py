from flask import Blueprint, request, jsonify
from .models import Product, Image
from . import db
from flask_login import login_required, current_user

products_bp = Blueprint('products', __name__)

@products_bp.route('/my-listings', methods=['GET'])
@login_required
def get_my_listings():
    products = Product.query.filter_by(user_id=current_user.id).order_by(Product.created_on.desc()).all()
    return jsonify([p.to_json() for p in products]), 200

@products_bp.route('/products', methods=['POST'])
@login_required
def add_product():
    data = request.get_json()

    name = data.get('name')
    location = data.get('location')
    price = data.get('price')
    unit = data.get('unit')
    description = data.get('description')
    images = data.get('images')

    if not all([name, location, price, unit, images]):
        return jsonify({"error": "Missing required fields"}), 400

    new_product = Product(
        name=name,
        location=location,
        price=float(price),
        unit=unit,
        description=description,
        user_id=current_user.id,
        status='Pending'
    )
    db.session.add(new_product)
    db.session.flush()

    for img_data in images:
        if img_data.get('url'):
            new_image = Image(url=img_data['url'], product_id=new_product.id)
            db.session.add(new_image)

    db.session.commit()

    return jsonify({"message": "Product submitted for approval", "product": new_product.to_json()}), 201
