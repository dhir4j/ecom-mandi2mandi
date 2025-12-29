"""
Airpay Payment Gateway Integration Utilities
Based on Airpay Python SDK v4.0.0
Uses AES encryption, OAuth2 authentication, and checksum verification
"""
import hashlib
import zlib
import json
import base64
import requests
from datetime import datetime
from typing import Dict, Optional, Any
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


class AirpayV4Functions:
    """
    Airpay V4 API encryption and checksum utilities
    Based on official Airpay Python SDK v4
    """

    @staticmethod
    def encrypt_string(my_string: str, username: str, password: str) -> str:
        """
        Encrypt data using AES-CBC encryption for Airpay V4 API

        Args:
            my_string: JSON string to encrypt
            username: Airpay username
            password: Airpay password

        Returns:
            IV + base64 encoded encrypted data
        """
        # Generate secret key from username and password
        secret_key = hashlib.md5(f"{username}~:~{password}".encode()).hexdigest()

        # Fixed IV for Airpay (as per their SDK)
        iv = 'c0f9e2d16031b0ce'

        # Pad the request data and encrypt using AES-CBC
        cipher = AES.new(secret_key.encode(), AES.MODE_CBC, iv.encode())
        encrypted_data = cipher.encrypt(pad(my_string.encode(), AES.block_size))

        # Combine IV and encrypted data, then base64 encode
        data = iv + base64.b64encode(encrypted_data).decode()

        return data

    @staticmethod
    def decrypt_string(encrypted_data: str, username: str, password: str) -> str:
        """
        Decrypt response from Airpay V4 API

        Args:
            encrypted_data: Encrypted response from Airpay (IV + encrypted data)
            username: Airpay username
            password: Airpay password

        Returns:
            Decrypted JSON string
        """
        # Generate secret key from username and password
        secret_key = hashlib.md5(f"{username}~:~{password}".encode()).hexdigest()

        # Extract IV (first 16 chars) and encrypted data
        iv = encrypted_data[:16]
        encrypted_data = encrypted_data[16:]

        # Decrypt the data using AES-CBC
        cipher = AES.new(secret_key.encode(), AES.MODE_CBC, iv.encode())
        decrypted_data = cipher.decrypt(base64.b64decode(encrypted_data))

        # Remove padding from the decrypted data
        unpadded_data = unpad(decrypted_data, AES.block_size)

        return unpadded_data.decode()

    @staticmethod
    def checksum_cal(post_data: Dict[str, Any]) -> str:
        """
        Calculate checksum for Airpay V4 API request

        Args:
            post_data: Dictionary of parameters (will be sorted alphabetically)

        Returns:
            SHA256 checksum
        """
        # Sort data alphabetically by key
        sorted_data = sorted(post_data.items(), key=lambda x: x[0])
        # Concatenate all values
        data = ''.join([str(value) for _, value in sorted_data])
        # Add today's date
        data_with_date = data + datetime.now().strftime("%Y-%m-%d")
        # Calculate SHA256 hash
        return hashlib.sha256(data_with_date.encode()).hexdigest()

    @staticmethod
    def encrypt_sha(data: str, salt: str) -> str:
        """
        Encrypt data using SHA256 (for privatekey generation)

        Args:
            data: Data to encrypt (username:|:password)
            salt: Secret key

        Returns:
            SHA256 hash
        """
        key = salt + '@' + data
        return hashlib.sha256(key.encode()).hexdigest()

    @staticmethod
    def verify_response_checksum(response_data: Dict[str, str], merchant_id: str,
                                  username: str) -> tuple[bool, str]:
        """
        Verify Airpay callback response using CRC32 checksum

        Args:
            response_data: Response data from Airpay
            merchant_id: Airpay merchant ID
            username: Airpay username

        Returns:
            Tuple of (is_valid, merchant_secure_hash)
        """
        transaction_id = str(response_data.get('orderid', response_data.get('TRANSACTIONID', ''))).strip()
        ap_transaction_id = str(response_data.get('ap_transactionid', response_data.get('APTRANSACTIONID', ''))).strip()
        amount = str(response_data.get('amount', response_data.get('AMOUNT', ''))).strip()
        transaction_status = str(response_data.get('transaction_status', response_data.get('TRANSACTIONSTATUS', ''))).strip()
        message = str(response_data.get('message', response_data.get('MESSAGE', ''))).strip()
        ap_secure_hash = str(response_data.get('ap_securehash', response_data.get('ap_SecureHash', ''))).strip()
        chmod = str(response_data.get('chmod', response_data.get('CHMOD', ''))).strip()
        customer_vpa = str(response_data.get('CUSTOMERVPA', '')).strip()

        # Build CRC data string
        crc_data = f"{transaction_id}:{ap_transaction_id}:{amount}:{transaction_status}:{message}:{merchant_id}:{username}"

        # Add UPI VPA if payment method is UPI
        if chmod.lower() == 'upi' and customer_vpa:
            crc_data += f":{customer_vpa}"

        # Calculate CRC32 checksum
        mer_sec_hash = zlib.crc32(crc_data.encode('utf-8')) & 0xffffffff
        merchant_secure_hash = "%u" % mer_sec_hash

        # Verify against Airpay's hash
        is_valid = ap_secure_hash == merchant_secure_hash

        return is_valid, merchant_secure_hash


def get_oauth2_token(merchant_id: str, username: str, password: str,
                     client_id: str, client_secret: str) -> Optional[str]:
    """
    Get OAuth2 access token from Airpay V4 API

    Args:
        merchant_id: Airpay merchant ID
        username: Airpay username
        password: Airpay password
        client_id: OAuth2 client ID
        client_secret: OAuth2 client secret

    Returns:
        Access token string or None if error
    """
    token_url = 'https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/'

    # Prepare OAuth2 request
    request = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'client_credentials',
        'merchant_id': merchant_id
    }

    request_string = json.dumps(request)

    # Encrypt request
    functions = AirpayV4Functions()
    encdata = functions.encrypt_string(request_string, username, password)

    # Calculate checksum
    checksum = functions.checksum_cal(request)

    # Prepare form data
    req = {
        'merchant_id': merchant_id,
        'encdata': encdata,
        'checksum': checksum
    }

    try:
        # Send POST request
        response = requests.post(token_url, data=req, timeout=30)
        response_json = response.json()

        # Decrypt response
        decrypt_data = functions.decrypt_string(response_json['response'], username, password)
        token_response = json.loads(decrypt_data)

        # Check for errors
        if 'success' in token_response and not token_response['success']:
            print(f"[AIRPAY ERROR] Token request failed: {token_response.get('msg', 'Unknown error')}")
            return None

        # Extract access token
        access_token = token_response.get('data', {}).get('access_token')
        if not access_token:
            print("[AIRPAY ERROR] No access token in response")
            return None

        return access_token

    except Exception as e:
        print(f"[AIRPAY ERROR] Exception getting OAuth2 token: {str(e)}")
        return None


def build_payment_request(
    buyer_email: str,
    buyer_first_name: str,
    buyer_last_name: str,
    buyer_phone: str,
    buyer_address: str,
    buyer_city: str,
    buyer_state: str,
    buyer_country: str,
    buyer_pincode: str,
    amount: str,
    order_id: str,
    currency: str = "356",  # INR code
    iso_currency: str = "INR",
    merchant_id: str = "",
    username: str = "",
    password: str = "",
    secret_key: str = "",
    client_id: str = "",
    client_secret: str = "",
) -> Dict[str, str]:
    """
    Build Airpay V4 payment request parameters with OAuth2 token

    Args:
        All buyer and payment details plus OAuth2 credentials

    Returns:
        Dictionary of payment parameters to send to Airpay V4
    """
    import re

    # Sanitize names to meet Airpay requirements (alphanumeric + spaces only)
    def sanitize_name(name):
        if not name:
            return "User"
        sanitized = re.sub(r'[^A-Za-z0-9\s]', '', name)
        sanitized = ' '.join(sanitized.split())
        return sanitized if sanitized else "User"

    buyer_first_name = sanitize_name(buyer_first_name)
    buyer_last_name = sanitize_name(buyer_last_name)

    # Ensure required fields are not empty
    if not buyer_email:
        buyer_email = ''

    # Validate and sanitize phone number
    if not buyer_phone or len(str(buyer_phone).strip()) == 0:
        # Use a realistic-looking placeholder (Indian mobile format)
        # Airpay rejects obvious patterns like 9999999999, 1111111111, etc.
        buyer_phone = '7012345678'
    else:
        # Remove any non-digit characters
        buyer_phone = ''.join(filter(str.isdigit, str(buyer_phone)))
        # Ensure it's 10 digits for Indian mobile format
        if len(buyer_phone) != 10:
            # Pad or truncate to 10 digits
            if len(buyer_phone) < 10:
                buyer_phone = '7012345678'  # Use placeholder if too short
            else:
                buyer_phone = buyer_phone[:10]  # Truncate if too long

    print(f"[AIRPAY V4 DEBUG] Sanitized buyer_phone: {buyer_phone}")

    # Step 1: Get OAuth2 access token
    print(f"[AIRPAY V4 DEBUG] Getting OAuth2 token...")
    access_token = get_oauth2_token(merchant_id, username, password, client_id, client_secret)

    if not access_token:
        raise Exception("Failed to get OAuth2 access token from Airpay")

    print(f"[AIRPAY V4 DEBUG] Got access token: {access_token[:20]}...")

    # Step 2: Prepare payment data
    mer_dom = base64.b64encode(b'http://track.airpay.co.in').decode('utf-8')

    post_data = {
        'buyer_email': buyer_email,
        'buyer_firstname': buyer_first_name,
        'buyer_lastname': buyer_last_name,
        'buyer_address': buyer_address if buyer_address else '',
        'buyer_city': buyer_city if buyer_city else '',
        'buyer_state': buyer_state if buyer_state else '',
        'buyer_country': buyer_country if buyer_country else '',
        'amount': amount,
        'orderid': order_id,
        'buyer_phone': buyer_phone,
        'buyer_pincode': buyer_pincode if buyer_pincode else '',
        'iso_currency': iso_currency,
        'currency_code': currency,
        'merchant_id': merchant_id,
        'mer_dom': mer_dom
    }

    # Step 3: Encrypt payment data
    functions = AirpayV4Functions()
    data_json = json.dumps(post_data)
    request_data = functions.encrypt_string(data_json, username, password)

    # Step 4: Calculate checksum
    checksum_req = functions.checksum_cal(post_data)

    # Step 5: Generate privatekey
    privatekey = functions.encrypt_sha(f"{username}:|:{password}", secret_key)

    # Step 6: Build payment URL with token
    payment_url = f'https://payments.airpay.co.in/pay/v4/index.php?token={access_token}'

    # Return parameters for form submission
    payment_params = {
        'privatekey': privatekey,
        'merchant_id': merchant_id,
        'encdata': request_data,
        'checksum': checksum_req,
        'chmod': '',  # Empty chmod as per reference
        'airpay_url': payment_url  # Frontend expects 'airpay_url' field
    }

    print(f"[AIRPAY V4 DEBUG] Payment params prepared successfully")
    print(f"[AIRPAY V4 DEBUG] Payment URL: {payment_url[:50]}...")

    return payment_params


def validate_callback_response(
    response_data: Dict[str, str],
    merchant_id: str,
    username: str,
    password: str
) -> Dict[str, Any]:
    """
    Validate and parse Airpay V4 callback response

    Args:
        response_data: Form data from Airpay callback (contains 'response' field)
        merchant_id: Airpay merchant ID
        username: Airpay username
        password: Airpay password

    Returns:
        Dictionary with validation result and parsed data
    """
    result = {
        'valid': False,
        'error': None,
        'transaction_id': None,
        'ap_transaction_id': None,
        'amount': None,
        'status': None,
        'message': None
    }

    # Check for response field
    if 'response' not in response_data or not response_data['response']:
        result['error'] = "Response is empty or missing 'response' field"
        return result

    try:
        # Decrypt response
        functions = AirpayV4Functions()
        decrypted_data = functions.decrypt_string(response_data['response'], username, password)
        data_dict = json.loads(decrypted_data)

        # Extract data from response
        data = data_dict.get('data', {})

        transaction_id = str(data.get('orderid', '')).strip()
        ap_transaction_id = str(data.get('ap_transactionid', '')).strip()
        amount = str(data.get('amount', '')).strip()
        transaction_status = str(data.get('transaction_status', '')).strip()
        message = str(data.get('message', '')).strip()

        # Verify checksum
        is_valid, calculated_hash = functions.verify_response_checksum(
            data,
            merchant_id,
            username
        )

        if not is_valid:
            result['error'] = (
                f"Checksum verification failed. "
                f"Airpay hash: {data.get('ap_securehash')}, "
                f"Calculated hash: {calculated_hash}"
            )
            return result

        # Parse response data
        result['valid'] = True
        result['transaction_id'] = transaction_id
        result['ap_transaction_id'] = ap_transaction_id
        result['amount'] = amount
        result['status'] = transaction_status
        result['message'] = message
        result['custom_var'] = data.get('custom_var', '')

        return result

    except Exception as e:
        result['error'] = f"Error decrypting/parsing response: {str(e)}"
        return result
