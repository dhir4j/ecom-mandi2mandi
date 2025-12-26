import os
from api import create_app, db
from api.models import User
from getpass import getpass

def main():
    """
    CLI tool to create or update an admin user for Mandi2Mandi.
    """
    app = create_app()
    with app.app_context():
        print("Mandi2Mandi Admin User Setup")
        print("============================")

        email = input("Enter admin email [admin@mandi2mandi.com]: ") or "admin@mandi2mandi.com"
        name = input("Enter admin name [Admin User]: ") or "Admin User"
        
        while True:
            password = getpass("Enter new admin password: ")
            if not password:
                print("Password cannot be empty. Please try again.")
                continue
            
            password_confirm = getpass("Confirm new admin password: ")
            if password == password_confirm:
                break
            else:
                print("Passwords do not match. Please try again.")

        # Check if user exists
        user = User.query.filter_by(email=email).first()

        if user:
            print(f"Updating existing user with email: {email}")
            user.name = name
            user.password = password  # The model's setter will handle hashing
            user.role = 'admin'
        else:
            print(f"Creating new admin user with email: {email}")
            user = User(
                name=name,
                email=email,
                password=password,
                role='admin'
            )
            db.session.add(user)
        
        try:
            db.session.commit()
            print("\nAdmin user has been successfully created/updated!")
        except Exception as e:
            db.session.rollback()
            print(f"\nAn error occurred: {e}")

if __name__ == '__main__':
    main()
