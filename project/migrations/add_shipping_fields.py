"""
Database Migration Script: Add Shipping Fields to Inquiries Table
This adds shipping-related fields to support seller-defined shipping rates

Usage:
    python migrations/add_shipping_fields.py
"""

import sys
import os

# Add parent directory to path to import project modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api import db, create_app
from sqlalchemy import text

def add_shipping_fields():
    """Add shipping fields to inquiries table"""
    app = create_app()

    with app.app_context():
        try:
            print("=" * 60)
            print("Adding shipping fields to inquiries table...")
            print("=" * 60)

            # Check if columns already exist
            result = db.session.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'inquiries'
            """))
            existing_columns = [row[0] for row in result]

            print(f"\nExisting columns in inquiries table: {len(existing_columns)} columns")

            migrations_needed = []

            # Add shipping_rate_per_kg column
            if 'shipping_rate_per_kg' not in existing_columns:
                print("✅ Adding 'shipping_rate_per_kg' column...")
                migrations_needed.append("""
                    ALTER TABLE inquiries
                    ADD COLUMN shipping_rate_per_kg FLOAT
                """)
            else:
                print("✓ 'shipping_rate_per_kg' column already exists")

            # Add shipping_charge column
            if 'shipping_charge' not in existing_columns:
                print("✅ Adding 'shipping_charge' column...")
                migrations_needed.append("""
                    ALTER TABLE inquiries
                    ADD COLUMN shipping_charge FLOAT
                """)
            else:
                print("✓ 'shipping_charge' column already exists")

            # Add final_total column
            if 'final_total' not in existing_columns:
                print("✅ Adding 'final_total' column...")
                migrations_needed.append("""
                    ALTER TABLE inquiries
                    ADD COLUMN final_total FLOAT
                """)
            else:
                print("✓ 'final_total' column already exists")

            if not migrations_needed:
                print("\n✅ All shipping fields already exist. No migration needed.")
                return

            # Execute migrations
            print(f"\n🔄 Running {len(migrations_needed)} migrations...")
            for i, sql in enumerate(migrations_needed, 1):
                print(f"\n[{i}/{len(migrations_needed)}] Executing migration...")
                db.session.execute(text(sql))

            db.session.commit()
            print("\n" + "=" * 60)
            print("✅ Migration completed successfully!")
            print("=" * 60)
            print("\nAdded columns to 'inquiries' table:")
            if 'shipping_rate_per_kg' not in existing_columns:
                print("  - shipping_rate_per_kg (FLOAT) - Per kg shipping rate set by seller")
            if 'shipping_charge' not in existing_columns:
                print("  - shipping_charge (FLOAT) - Total shipping charge calculated")
            if 'final_total' not in existing_columns:
                print("  - final_total (FLOAT) - Product price + shipping charge")
            print("\n" + "=" * 60)

        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == '__main__':
    add_shipping_fields()
