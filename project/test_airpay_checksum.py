#!/usr/bin/env python3
"""
Test script to verify Airpay checksum calculation
Run this to test if checksum is being calculated correctly
"""
import sys
import hashlib
from datetime import datetime

# Airpay credentials from .credentials/AIRPAY_CREDENTIALS.txt
MERCHANT_ID = "351531"
USERNAME = "KpSC7CxDab"
PASSWORD = "KQF8mYAc"
SECRET_KEY = "KYp2Nkg9gvjNqDtT"

# Test data
buyer_email = "test@example.com"
buyer_first_name = "Test"
buyer_last_name = "User"
amount = "199.00"
order_id = "TXN123456789"
today = datetime.now().strftime("%Y-%m-%d")

print("="*60)
print("AIRPAY CHECKSUM CALCULATION TEST")
print("="*60)
print(f"\nTest Data:")
print(f"  buyerEmail: '{buyer_email}'")
print(f"  buyerFirstName: '{buyer_first_name}'")
print(f"  buyerLastName: '{buyer_last_name}'")
print(f"  amount: '{amount}'")
print(f"  orderid: '{order_id}'")
print(f"  today: '{today}'")
print(f"\nCredentials:")
print(f"  merchant_id: {MERCHANT_ID}")
print(f"  username: {USERNAME}")
print(f"  password: {PASSWORD}")
print(f"  secret_key: {SECRET_KEY}")

# Step 1: Build alldata (simple format - no address)
alldata = buyer_email + buyer_first_name + buyer_last_name + amount + order_id
print(f"\nStep 1: Build alldata")
print(f"  alldata = buyerEmail + buyerFirstName + buyerLastName + amount + orderid")
print(f"  alldata = '{alldata}'")

# Step 2: Generate privatekey
# Format: hash('sha256', secret.'@'.username.':|:'.password)
privatekey_data = f"{SECRET_KEY}@{USERNAME}:|:{PASSWORD}"
privatekey = hashlib.sha256(privatekey_data.encode('utf-8')).hexdigest()
print(f"\nStep 2: Generate privatekey")
print(f"  privatekey_data = secret + '@' + username + ':|:' + password")
print(f"  privatekey_data = '{privatekey_data}'")
print(f"  privatekey = SHA256(privatekey_data)")
print(f"  privatekey = {privatekey}")

# Step 3: Generate key_sha256
# Format: hash('SHA256', username.'~:~'.password)
key_data = f"{USERNAME}~:~{PASSWORD}"
key_sha256 = hashlib.sha256(key_data.encode('utf-8')).hexdigest()
print(f"\nStep 3: Generate key_sha256")
print(f"  key_data = username + '~:~' + password")
print(f"  key_data = '{key_data}'")
print(f"  key_sha256 = SHA256(key_data)")
print(f"  key_sha256 = {key_sha256}")

# Step 4: Calculate checksum
# Format: hash('SHA256', key_sha256.'@'.alldata.date)
checksum_data = alldata + today
checksum_input = f"{key_sha256}@{checksum_data}"
checksum = hashlib.sha256(checksum_input.encode('utf-8')).hexdigest()
print(f"\nStep 4: Calculate checksum")
print(f"  checksum_data = alldata + today")
print(f"  checksum_data = '{checksum_data}'")
print(f"  checksum_input = key_sha256 + '@' + checksum_data")
print(f"  checksum_input = '{checksum_input}'")
print(f"  checksum = SHA256(checksum_input)")
print(f"  checksum = {checksum}")

# Step 5: Generate UID
uid = hashlib.sha256(f"{USERNAME}{order_id}{today}".encode('utf-8')).hexdigest()
print(f"\nStep 5: Generate UID")
print(f"  UID = SHA256(username + orderid + today)")
print(f"  UID = {uid}")

print("\n" + "="*60)
print("FINAL PARAMETERS TO SEND TO AIRPAY")
print("="*60)
print(f"buyerEmail: {buyer_email}")
print(f"buyerPhone: 0000000000")
print(f"buyerFirstName: {buyer_first_name}")
print(f"buyerLastName: {buyer_last_name}")
print(f"buyerAddress: ")
print(f"buyerCity: ")
print(f"buyerState: ")
print(f"buyerCountry: ")
print(f"buyerPinCode: ")
print(f"orderid: {order_id}")
print(f"amount: {amount}")
print(f"UID: {uid}")
print(f"privatekey: {privatekey}")
print(f"mercid: {MERCHANT_ID}")
print(f"kittype: inline")
print(f"checksum: {checksum}")
print(f"currency: 356")
print(f"isocurrency: INR")
print("="*60)
