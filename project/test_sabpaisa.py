"""
Test script to verify SabPaisa parameter generation
Run this on PythonAnywhere to debug the integration
"""
import sys
sys.path.insert(0, '/home/simple4j/mandi2mandi/project')

from api.sabpaisa_utils import build_payment_request, create_encrypted_request
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get credentials
client_code = os.getenv('SABPAISA_CLIENT_CODE')
username = os.getenv('SABPAISA_USERNAME')
password = os.getenv('SABPAISA_PASSWORD')
auth_key = os.getenv('SABPAISA_AUTH_KEY')
auth_iv = os.getenv('SABPAISA_AUTH_IV')
base_url = os.getenv('SABPAISA_BASE_URL')

print("=" * 80)
print("SABPAISA CONFIGURATION TEST")
print("=" * 80)
print(f"Client Code: {client_code}")
print(f"Username: {username}")
print(f"Password: {'*' * len(password) if password else 'NOT SET'}")
print(f"Auth Key: {auth_key[:20]}..." if auth_key else "NOT SET")
print(f"Auth IV: {auth_iv[:20]}..." if auth_iv else "NOT SET")
print(f"Base URL: {base_url}")
print("=" * 80)

# Test parameter generation
test_params = build_payment_request(
    payer_name="Test User",
    payer_email="test@example.com",
    payer_mobile="9876543210",
    client_txn_id="TEST123456",
    amount=100.0,
    client_code=client_code,
    trans_username=username,
    trans_password=password,
    callback_url="https://www.mandi.ramhotravels.com/api/sabpaisa-payment-success",
    udf1="Test Product"
)

print("\nGENERATED PARAMETER STRING (before encryption):")
print("-" * 80)
print(test_params)
print("-" * 80)

# Test encryption
encrypted = create_encrypted_request(test_params, auth_key, auth_iv)
print("\nENCRYPTED DATA (encData):")
print("-" * 80)
print(encrypted[:100] + "..." if len(encrypted) > 100 else encrypted)
print(f"\nTotal encrypted length: {len(encrypted)} characters")
print("-" * 80)

print("\nFORM DATA TO BE SENT:")
print("-" * 80)
print(f"encData: {encrypted[:50]}...")
print(f"clientCode: {client_code}")
print("-" * 80)

print("\nPOST URL:")
print(base_url)
print("=" * 80)
