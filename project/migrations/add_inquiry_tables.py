"""
Database Migration Script: Add Inquiry and Chat Message Tables
Run this script to add inquiry and chat message tables

Usage:
    python migrations/add_inquiry_tables.py
"""

import sys
import os

# Add parent directory to path to import project modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api import db, create_app
from sqlalchemy import text

def add_inquiry_tables():
    """Add inquiry and chat message tables"""
    app = create_app()

    with app.app_context():
        try:
            print("=" * 60)
            print("Checking existing tables...")
            print("=" * 60)

            # Check if tables already exist
            result = db.session.execute(text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
            ))
            existing_tables = [row[0] for row in result]

            print(f"Existing tables: {existing_tables}")

            migrations_needed = []

            # Create inquiries table if it doesn't exist
            if 'inquiries' not in existing_tables:
                print("\n✅ Creating 'inquiries' table...")
                migrations_needed.append("""
                    CREATE TABLE inquiries (
                        id SERIAL PRIMARY KEY,
                        product_id INTEGER NOT NULL,
                        product_name VARCHAR(200) NOT NULL,
                        seller_id INTEGER NOT NULL,
                        seller_name VARCHAR(150) NOT NULL,
                        buyer_id INTEGER NOT NULL,
                        buyer_name VARCHAR(150) NOT NULL,
                        quantity FLOAT NOT NULL,
                        unit VARCHAR(50) NOT NULL,
                        estimated_price FLOAT NOT NULL,
                        price_per_unit FLOAT NOT NULL,
                        address_line_1 VARCHAR(255) NOT NULL,
                        address_line_2 VARCHAR(255),
                        city VARCHAR(100) NOT NULL,
                        state VARCHAR(100) NOT NULL,
                        pincode VARCHAR(10) NOT NULL,
                        mobile VARCHAR(20) NOT NULL,
                        additional_notes TEXT,
                        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
                        created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        responded_on TIMESTAMP,
                        FOREIGN KEY (seller_id) REFERENCES users(id),
                        FOREIGN KEY (buyer_id) REFERENCES users(id)
                    )
                """)
            else:
                print("\n✓ 'inquiries' table already exists")

            # Create chat_messages table if it doesn't exist
            if 'chat_messages' not in existing_tables:
                print("\n✅ Creating 'chat_messages' table...")
                migrations_needed.append("""
                    CREATE TABLE chat_messages (
                        id SERIAL PRIMARY KEY,
                        inquiry_id INTEGER NOT NULL,
                        sender_id INTEGER NOT NULL,
                        sender_name VARCHAR(150) NOT NULL,
                        sender_role VARCHAR(50) NOT NULL,
                        message TEXT NOT NULL,
                        created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        is_read BOOLEAN NOT NULL DEFAULT FALSE,
                        FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
                        FOREIGN KEY (sender_id) REFERENCES users(id)
                    )
                """)
            else:
                print("\n✓ 'chat_messages' table already exists")

            if not migrations_needed:
                print("\n✅ All tables already exist. No migration needed.")
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
            print("\nCreated tables:")
            if 'inquiries' not in existing_tables:
                print("  - inquiries (inquiry management)")
            if 'chat_messages' not in existing_tables:
                print("  - chat_messages (buyer-seller chat)")
            print("\n" + "=" * 60)

        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            raise

if __name__ == '__main__':
    add_inquiry_tables()
