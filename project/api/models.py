from . import db, bcrypt
from flask_login import UserMixin
import datetime

class User(db.Model, UserMixin):
    """User Model"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='buyer')
    registered_on = db.Column(db.DateTime, nullable=False)

    # Subscription fields
    has_subscription = db.Column(db.Boolean, nullable=False, default=False)
    subscription_expiry = db.Column(db.DateTime, nullable=True)
    subscription_txn_id = db.Column(db.String(100), nullable=True)
    subscription_payu_id = db.Column(db.String(100), nullable=True)
    subscription_amount = db.Column(db.Float, nullable=True)

    products = db.relationship('Product', backref='user', lazy=True)
    orders = db.relationship('Order', backref='buyer', lazy=True)

    def __init__(self, name, email, password, role='buyer'):
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role
        self.registered_on = datetime.datetime.now()
        self.has_subscription = False

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'hasSubscription': self.has_subscription,
            'subscriptionExpiry': self.subscription_expiry.isoformat() if self.subscription_expiry else None,
            'createdAt': self.registered_on.isoformat() if self.registered_on else None
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    images = db.relationship('Image', backref='product', lazy=True, cascade="all, delete-orphan")

    def to_json(self, with_seller=False):
        data = {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'price': f"₹{self.price:,.0f} / {self.unit.capitalize()}",
            'status': self.status,
            'images': [image.url for image in self.images]
        }
        if with_seller:
            data['seller'] = self.user.to_json()
        return data

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String(500), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    payment_option = db.Column(db.String(50), nullable=False)
    utr_code = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Booked')
    
    # Structured Address
    buyer_name = db.Column(db.String(150), nullable=False)
    buyer_mobile = db.Column(db.String(20), nullable=False)
    address_line_1 = db.Column(db.String(255), nullable=False)
    address_line_2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    
    ordered_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_json(self, with_buyer=False):
        data = {
            'id': self.id,
            'order_id_display': f"ORD{self.id:06d}",
            'product_name': self.product_name,
            'date': self.ordered_on.strftime('%Y-%m-%d'),
            'total': f"₹{self.total_price:,.2f}",
            'status': self.status,
        }
        if with_buyer:
            data['buyer'] = self.buyer.to_json()
        return data
    
    def to_invoice_json(self):
        full_address = f"{self.address_line_1}"
        if self.address_line_2:
            full_address += f", {self.address_line_2}"
        full_address += f", {self.city}, {self.state} - {self.pincode}"
        
        return {
            'id': self.id,
            'order_id_display': f"ORD{self.id:06d}",
            'product_name': self.product_name,
            'quantity': self.quantity,
            'unit': self.unit,
            'total_price': self.total_price,
            'amount_paid': self.amount_paid,
            'payment_option': self.payment_option,
            'utr_code': self.utr_code,
            'status': self.status,
            'delivery_address': full_address, # For backward compatibility with old invoice view
            'buyer_name': self.buyer_name,
            'buyer_mobile': self.buyer_mobile,
            'ordered_on': self.ordered_on.strftime('%Y-%m-%d %H:%M:%S'),
            # Structured address for new invoice view
            'address': {
              'line1': self.address_line_1,
              'line2': self.address_line_2,
              'city': self.city,
              'state': self.state,
              'pincode': self.pincode,
            }
        }

class Inquiry(db.Model):
    """Inquiry Model - for buyer inquiries awaiting seller approval"""
    __tablename__ = 'inquiries'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    seller_name = db.Column(db.String(150), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    buyer_name = db.Column(db.String(150), nullable=False)

    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    estimated_price = db.Column(db.Float, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)

    # Delivery address
    address_line_1 = db.Column(db.String(255), nullable=False)
    address_line_2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    mobile = db.Column(db.String(20), nullable=False)

    additional_notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), nullable=False, default='Pending')  # Pending, Approved, Rejected

    # Shipping fields (set by seller/admin when approving)
    shipping_rate_per_kg = db.Column(db.Float, nullable=True)  # Per kg shipping rate
    shipping_charge = db.Column(db.Float, nullable=True)  # Total shipping charge
    final_total = db.Column(db.Float, nullable=True)  # estimated_price + shipping_charge

    created_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    responded_on = db.Column(db.DateTime, nullable=True)

    # Relationships
    seller = db.relationship('User', foreign_keys=[seller_id], backref='seller_inquiries')
    buyer = db.relationship('User', foreign_keys=[buyer_id], backref='buyer_inquiries')

    def to_json(self):
        return {
            'id': self.id,
            'inquiryId': f"INQ{self.id:06d}",
            'productId': self.product_id,
            'productName': self.product_name,
            'sellerId': self.seller_id,
            'sellerName': self.seller_name,
            'buyerId': self.buyer_id,
            'buyerName': self.buyer_name,
            'quantity': self.quantity,
            'unit': self.unit,
            'estimatedPrice': self.estimated_price,
            'pricePerUnit': self.price_per_unit,
            'address': {
                'line1': self.address_line_1,
                'line2': self.address_line_2,
                'city': self.city,
                'state': self.state,
                'pincode': self.pincode,
            },
            'mobile': self.mobile,
            'additionalNotes': self.additional_notes,
            'status': self.status,
            'shippingRatePerKg': self.shipping_rate_per_kg,
            'shippingCharge': self.shipping_charge,
            'finalTotal': self.final_total,
            'createdOn': self.created_on.isoformat(),
            'respondedOn': self.responded_on.isoformat() if self.responded_on else None,
        }

class ChatMessage(db.Model):
    """Chat Message Model - for storing chat history between buyer and seller"""
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    inquiry_id = db.Column(db.Integer, db.ForeignKey('inquiries.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender_name = db.Column(db.String(150), nullable=False)
    sender_role = db.Column(db.String(50), nullable=False)  # buyer, seller, admin
    message = db.Column(db.Text, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    is_read = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    inquiry = db.relationship('Inquiry', backref='messages')
    sender = db.relationship('User', foreign_keys=[sender_id])

    def to_json(self):
        return {
            'id': self.id,
            'inquiryId': self.inquiry_id,
            'senderId': self.sender_id,
            'senderName': self.sender_name,
            'senderRole': self.sender_role,
            'message': self.message,
            'createdOn': self.created_on.isoformat(),
            'isRead': self.is_read,
        }
