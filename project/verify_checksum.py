#!/usr/bin/env python3
"""
Verify the exact checksum from the browser console
"""
import hashlib
from datetime import datetime

# Exact values from browser console
buyer_email = "test21@gmail.com"
buyer_first_name = "test21gmailcom"
buyer_last_name = "test21gmailcom"
amount = "199.00"
order_id = "TXN17667858754642"

# Airpay credentials
MERCHANT_ID = "351531"
USERNAME = "KpSC7CxDab"
PASSWORD = "KQF8mYAc"
SECRET_KEY = "KYp2Nkg9gvjNqDtT"

# Date from production (2025-12-26 based on earlier test)
today = "2025-12-26"

print("="*80)
print("VERIFYING ACTUAL CHECKSUM FROM CONSOLE LOGS")
print("="*80)
print(f"\nInput values:")
print(f"  buyerEmail: '{buyer_email}'")
print(f"  buyerFirstName: '{buyer_first_name}'")
print(f"  buyerLastName: '{buyer_last_name}'")
print(f"  amount: '{amount}'")
print(f"  orderid: '{order_id}'")
print(f"  today: '{today}'")

# Build alldata (without address)
alldata = buyer_email + buyer_first_name + buyer_last_name + amount + order_id
print(f"\nalldata = buyerEmail + buyerFirstName + buyerLastName + amount + orderid")
print(f"alldata = '{alldata}'")

# Generate privatekey
privatekey_data = f"{SECRET_KEY}@{USERNAME}:|:{PASSWORD}"
privatekey = hashlib.sha256(privatekey_data.encode('utf-8')).hexdigest()
print(f"\nprivatekey = {privatekey}")

# Generate key_sha256
key_data = f"{USERNAME}~:~{PASSWORD}"
key_sha256 = hashlib.sha256(key_data.encode('utf-8')).hexdigest()
print(f"key_sha256 = {key_sha256}")

# Calculate checksum
checksum_data = alldata + today
checksum_input = f"{key_sha256}@{checksum_data}"
checksum = hashlib.sha256(checksum_input.encode('utf-8')).hexdigest()

print(f"\nchecksum_data = alldata + today")
print(f"checksum_data = '{checksum_data}'")
print(f"\nchecksum_input = key_sha256 + '@' + checksum_data")
print(f"checksum_input = '{checksum_input}'")
print(f"\nCalculated checksum = {checksum}")

# Checksum from console
console_checksum = "605c03ff092d4eec164022561f61bb00187602b9ed29483648f8cfc0b4610cd3"
print(f"Console checksum    = {console_checksum}")

if checksum == console_checksum:
    print("\n✓ CHECKSUMS MATCH!")
else:
    print("\n✗ CHECKSUMS DO NOT MATCH!")
    print("\nThis means the server is calculating with different data.")

# Generate UID
uid = hashlib.sha256(f"{USERNAME}{order_id}{today}".encode('utf-8')).hexdigest()
console_uid = "eb94e2f12d792eaeafd08f200b98b6a58d5de9f03be275964965249ee948a33c"
print(f"\nCalculated UID = {uid}")
print(f"Console UID    = {console_uid}")

if uid == console_uid:
    print("✓ UIDs MATCH!")
else:
    print("✗ UIDs DO NOT MATCH!")

print("="*80)
