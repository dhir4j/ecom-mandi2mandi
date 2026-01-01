"""
Database Backup Script
Creates a SQL dump of your database before migration
Run this BEFORE deploying new code
"""

import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import create_app
from sqlalchemy import inspect
import json

def backup_table_data(table_name):
    """Backup data from a single table"""
    from api import db

    try:
        # Execute raw SQL to get all data
        result = db.session.execute(db.text(f"SELECT * FROM {table_name}"))
        columns = result.keys()
        rows = result.fetchall()

        # Convert to list of dicts
        data = []
        for row in rows:
            row_dict = {}
            for i, col in enumerate(columns):
                val = row[i]
                # Convert non-serializable types
                if hasattr(val, 'isoformat'):
                    val = val.isoformat()
                row_dict[col] = val
            data.append(row_dict)

        return {
            'table': table_name,
            'columns': list(columns),
            'row_count': len(data),
            'data': data
        }
    except Exception as e:
        print(f"  ⚠ Could not backup {table_name}: {str(e)}")
        return None

def create_backup():
    """Create a JSON backup of all tables"""
    app = create_app()

    with app.app_context():
        from api import db

        print("=" * 60)
        print("DATABASE BACKUP")
        print("=" * 60)

        # Get all tables
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()

        print(f"\n✓ Found {len(tables)} tables to backup")

        backup_data = {
            'timestamp': datetime.now().isoformat(),
            'tables': []
        }

        # Backup each table
        for table in tables:
            print(f"\n  Backing up: {table}...", end=" ")
            table_backup = backup_table_data(table)

            if table_backup:
                backup_data['tables'].append(table_backup)
                print(f"✓ ({table_backup['row_count']} rows)")
            else:
                print("✗ FAILED")

        # Save to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"database_backup_{timestamp}.json"

        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2, default=str)

        print("\n" + "=" * 60)
        print(f"✓ BACKUP SAVED: {backup_file}")
        print("=" * 60)

        # Print summary
        print("\nBackup Summary:")
        for table_backup in backup_data['tables']:
            print(f"  - {table_backup['table']}: {table_backup['row_count']} rows")

        print(f"\n✓ Total tables backed up: {len(backup_data['tables'])}")
        print(f"✓ Backup file size: {os.path.getsize(backup_file) / 1024:.2f} KB")

        return backup_file

if __name__ == '__main__':
    backup_file = create_backup()
    print(f"\n⚠ IMPORTANT: Keep this backup file safe!")
    print(f"   Location: {os.path.abspath(backup_file)}")
