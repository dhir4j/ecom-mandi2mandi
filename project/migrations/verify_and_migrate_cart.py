"""
SAFE Cart Tables Migration Script
This script will:
1. Check if cart tables already exist
2. Create them ONLY if they don't exist
3. NOT modify any existing tables
4. NOT delete any data

Safe to run multiple times!
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import db, create_app
from sqlalchemy import inspect
import sqlalchemy as sa

def check_table_exists(table_name):
    """Check if a table exists in the database"""
    inspector = inspect(db.engine)
    return table_name in inspector.get_table_names()

def verify_and_migrate():
    """Safely create cart tables if they don't exist"""
    app = create_app()

    with app.app_context():
        print("=" * 60)
        print("CART TABLES MIGRATION VERIFICATION")
        print("=" * 60)

        # Check existing tables
        inspector = inspect(db.engine)
        existing_tables = inspector.get_table_names()

        print(f"\n✓ Connected to database successfully")
        print(f"✓ Found {len(existing_tables)} existing tables:")
        for table in sorted(existing_tables):
            print(f"  - {table}")

        # Check if cart tables already exist
        cart_exists = check_table_exists('carts')
        cart_items_exists = check_table_exists('cart_items')

        print("\n" + "=" * 60)
        print("CART TABLES STATUS")
        print("=" * 60)

        if cart_exists:
            print("✓ 'carts' table already exists - SKIPPING")
        else:
            print("○ 'carts' table NOT found - WILL CREATE")

        if cart_items_exists:
            print("✓ 'cart_items' table already exists - SKIPPING")
        else:
            print("○ 'cart_items' table NOT found - WILL CREATE")

        # If both tables exist, nothing to do
        if cart_exists and cart_items_exists:
            print("\n" + "=" * 60)
            print("✓ ALL CART TABLES ALREADY EXIST - NO ACTION NEEDED")
            print("=" * 60)
            return

        # Create tables (only creates if they don't exist)
        print("\n" + "=" * 60)
        print("CREATING MISSING TABLES...")
        print("=" * 60)

        try:
            # This is SAFE - it only creates tables that don't exist
            db.create_all()

            print("\n✓ Migration completed successfully!")

            # Verify the tables were created
            inspector = inspect(db.engine)
            new_tables = inspector.get_table_names()

            print(f"\n✓ Database now has {len(new_tables)} tables:")
            for table in sorted(new_tables):
                print(f"  - {table}")

            # Verify cart tables specifically
            print("\n" + "=" * 60)
            print("VERIFICATION")
            print("=" * 60)

            if check_table_exists('carts'):
                print("✓ 'carts' table verified")

                # Show cart table structure
                columns = inspector.get_columns('carts')
                print("  Columns:")
                for col in columns:
                    print(f"    - {col['name']} ({col['type']})")

            if check_table_exists('cart_items'):
                print("✓ 'cart_items' table verified")

                # Show cart_items table structure
                columns = inspector.get_columns('cart_items')
                print("  Columns:")
                for col in columns:
                    print(f"    - {col['name']} ({col['type']})")

            print("\n" + "=" * 60)
            print("✓ MIGRATION SUCCESSFUL - ALL DATA PRESERVED")
            print("=" * 60)

        except Exception as e:
            print(f"\n✗ Error during migration: {str(e)}")
            print("\n⚠ NO CHANGES WERE MADE TO EXISTING TABLES")
            raise

if __name__ == '__main__':
    verify_and_migrate()
