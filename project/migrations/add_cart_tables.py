"""
Migration script to add Cart and CartItem tables
Run this script to update the database schema
"""

import sys
import os

# Add parent directory to path so we can import api module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import db, create_app
from api.models import Cart, CartItem

def add_cart_tables():
    """Add cart and cart_items tables to the database"""
    app = create_app()

    with app.app_context():
        try:
            # Create the tables
            db.create_all()
            print("✓ Cart and CartItem tables created successfully")
            print("✓ Migration completed!")

        except Exception as e:
            print(f"✗ Error during migration: {str(e)}")
            raise

if __name__ == '__main__':
    add_cart_tables()
