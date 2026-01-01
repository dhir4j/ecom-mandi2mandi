from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
import inspect

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app(config_class=None):
    app = Flask(__name__)
    # Directly use the Config class from config.py, ignoring any server-passed config
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
    # Allow all origins from the specific frontend URL for simplicity and robustness.
    CORS(app, supports_credentials=True, origins=[
        "https://mandi2mandi.com", 
        "https://mandi2mandi.vercel.app", 
        "https://mandi2mandi-1-0-0.web.app", 
        "https://6000-firebase-studio-1750850256213.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
    ])

    from .models import User, Product, Image, Order, Cart, CartItem, Inquiry, ChatMessage
    
    with app.app_context():
        # ✅ FIXED: Only create tables if they don't exist
        # DO NOT drop tables - this preserves all your data including admin users!
        db.create_all()


    @app.route('/')
    def index():
        return jsonify({"status": "Backend is running"})

    from .auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from .products import products_bp
    app.register_blueprint(products_bp, url_prefix='/api')

    from .orders import orders_bp
    app.register_blueprint(orders_bp, url_prefix='/api')

    from .payments import payments_bp
    app.register_blueprint(payments_bp, url_prefix='/api')

    from .inquiries import inquiries_bp
    app.register_blueprint(inquiries_bp, url_prefix='/api/inquiries')

    from .cart import cart_bp
    app.register_blueprint(cart_bp)

    from .admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app