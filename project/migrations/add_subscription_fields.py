"""
Database Migration Script: Add Subscription Fields to Users Table
Run this script to add subscription-related columns to the existing users table

Usage:
    python migrations/add_subscription_fields.py
"""

import sys
import os

# Add parent directory to path to import project modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api import db, create_app
from sqlalchemy import text

def add_subscription_columns():
    """Add subscription columns to users table"""
    app = create_app()

    with app.app_context():
        try:
            # Check if columns already exist (PostgreSQL syntax)
            result = db.session.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"
            ))
            columns = [row[0] for row in result]

            migrations_needed = []

            # Check which columns need to be added
            if 'has_subscription' not in columns:
                migrations_needed.append(
                    "ALTER TABLE users ADD COLUMN has_subscription BOOLEAN NOT NULL DEFAULT FALSE"
                )

            if 'subscription_expiry' not in columns:
                migrations_needed.append(
                    "ALTER TABLE users ADD COLUMN subscription_expiry TIMESTAMP NULL"
                )

            if 'subscription_txn_id' not in columns:
                migrations_needed.append(
                    "ALTER TABLE users ADD COLUMN subscription_txn_id VARCHAR(100) NULL"
                )

            if 'subscription_payu_id' not in columns:
                migrations_needed.append(
                    "ALTER TABLE users ADD COLUMN subscription_payu_id VARCHAR(100) NULL"
                )

            if 'subscription_amount' not in columns:
                migrations_needed.append(
                    "ALTER TABLE users ADD COLUMN subscription_amount FLOAT NULL"
                )

            if not migrations_needed:
                print("✅ All subscription columns already exist. No migration needed.")
                return

            # Execute migrations
            print(f"🔄 Running {len(migrations_needed)} migrations...")
            for i, sql in enumerate(migrations_needed, 1):
                print(f"   [{i}/{len(migrations_needed)}] {sql}")
                db.session.execute(text(sql))

            db.session.commit()
            print("✅ Migration completed successfully!")
            print("\nAdded columns:")
            print("  - has_subscription (BOOLEAN)")
            print("  - subscription_expiry (TIMESTAMP)")
            print("  - subscription_txn_id (VARCHAR)")
            print("  - subscription_payu_id (VARCHAR)")
            print("  - subscription_amount (FLOAT)")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Migration failed: {str(e)}")
            raise

if __name__ == '__main__':
    print("=" * 60)
    print("Database Migration: Add Subscription Fields")
    print("=" * 60)
    add_subscription_columns()
