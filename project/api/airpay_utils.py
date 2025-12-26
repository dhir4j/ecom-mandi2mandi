"""
Airpay Payment Gateway Integration Utilities
Based on Airpay Python SDK v3.0.0
Uses SHA256 encryption and CRC32 checksum verification
"""
import hashlib
import zlib
from datetime import datetime
from typing import Dict, Optional


class AirpayChecksum:
    """
    Airpay checksum and encryption utilities
    Based on official Airpay Python SDK
    """

    @staticmethod
    def encrypt(data: str, salt: str) -> str:
        """
        Encrypt data using SHA256 (Airpay privatekey generation)

        Args:
            data: Data to encrypt (username:|:password)
            salt: Secret key

        Returns:
            SHA256 hash string
        """
        key = salt + '@' + data
        encrypted = hashlib.sha256(key.encode('utf-8')).hexdigest()
        return encrypted

    @staticmethod
    def encrypt_sha256(data: str) -> str:
        """
        Create SHA256 hash of data

        Args:
            data: Data to hash (username~:~password)

        Returns:
            SHA256 hash string
        """
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    @staticmethod
    def calculate_checksum_sha256(data: str, salt: str) -> str:
        """
        Calculate SHA256 checksum for payment data

        Args:
            data: Payment data string (concatenated fields + date)
            salt: SHA256 hashed key

        Returns:
            SHA256 checksum
        """
        key = salt + '@' + data
        checksum = hashlib.sha256(key.encode('utf-8')).hexdigest()
        return checksum

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
        transaction_id = str(response_data.get('TRANSACTIONID', ''))
        ap_transaction_id = str(response_data.get('APTRANSACTIONID', ''))
        amount = str(response_data.get('AMOUNT', ''))
        transaction_status = str(response_data.get('TRANSACTIONSTATUS', ''))
        message = str(response_data.get('MESSAGE', ''))
        ap_secure_hash = str(response_data.get('ap_SecureHash', ''))
        chmod = str(response_data.get('CHMOD', ''))
        customer_vpa = str(response_data.get('CUSTOMERVPA', ''))

        # Build CRC data string
        crc_data = f"{transaction_id}:{ap_transaction_id}:{amount}:{transaction_status}:{message}:{merchant_id}:{username}"

        # Add UPI VPA if payment method is UPI
        if chmod == 'upi':
            crc_data += f":{customer_vpa}"

        # Calculate CRC32 checksum
        mer_sec_hash = zlib.crc32(crc_data.encode('utf-8')) & 0xffffffff
        merchant_secure_hash = "%u" % mer_sec_hash

        # Verify against Airpay's hash
        is_valid = ap_secure_hash == merchant_secure_hash

        return is_valid, merchant_secure_hash


def sanitize_airpay_name(name: str) -> str:
    """
    Sanitize name field for Airpay - must be alphanumeric with spaces only
    Regex: ^[A-Za-z\d\s]+$
    """
    import re
    if not name:
        return "User"

    # Remove special characters, keep only letters, numbers, and spaces
    sanitized = re.sub(r'[^A-Za-z0-9\s]', '', name)

    # Remove extra spaces
    sanitized = ' '.join(sanitized.split())

    return sanitized if sanitized else "User"


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
) -> Dict[str, str]:
    """
    Build Airpay payment request parameters

    Args:
        All buyer and payment details

    Returns:
        Dictionary of payment parameters to send to Airpay
    """
    import re

    today = datetime.now().strftime("%Y-%m-%d")

    # Sanitize names to meet Airpay requirements (alphanumeric + spaces only)
    buyer_first_name = sanitize_airpay_name(buyer_first_name)
    buyer_last_name = sanitize_airpay_name(buyer_last_name)

    # Ensure buyer_email is not empty (set to empty string if None)
    if not buyer_email:
        buyer_email = ''

    # Ensure buyer_phone is not empty (use dummy if empty as per API)
    if not buyer_phone:
        buyer_phone = '0000000000'

    # Build data string for checksum (order matters!)
    # Based on sendtoairpay.py lines 146-149
    # For SIMPLE TRANSACTION (not subscription), UID is NOT included in checksum
    # Format: buyerEmail + buyerFirstName + buyerLastName + [buyerAddress + buyerCity + buyerState + buyerCountry] + amount + orderid

    print(f"[AIRPAY DEBUG] Checksum calculation inputs:")
    print(f"  buyerEmail: '{buyer_email}'")
    print(f"  buyerFirstName: '{buyer_first_name}'")
    print(f"  buyerLastName: '{buyer_last_name}'")
    print(f"  buyerAddress: '{buyer_address}'")
    print(f"  buyerCity: '{buyer_city}'")
    print(f"  buyerState: '{buyer_state}'")
    print(f"  buyerCountry: '{buyer_country}'")
    print(f"  amount: '{amount}'")
    print(f"  orderid: '{order_id}'")
    print(f"  today: '{today}'")

    if buyer_address and buyer_city and buyer_state and buyer_country:
        # With address - as per reference implementation
        all_data = (
            buyer_email + buyer_first_name + buyer_last_name +
            buyer_address + buyer_city + buyer_state + buyer_country +
            amount + order_id
        )
        print(f"[AIRPAY DEBUG] Using WITH ADDRESS checksum format")
    else:
        # Without address - as per reference implementation
        all_data = (
            buyer_email + buyer_first_name + buyer_last_name +
            amount + order_id
        )
        print(f"[AIRPAY DEBUG] Using WITHOUT ADDRESS checksum format")

    print(f"[AIRPAY DEBUG] alldata: '{all_data}'")

    # Generate privatekey using encryption
    # Format: hash('sha256', secret.'@'.username.':|:'.password)
    checksum_obj = AirpayChecksum()
    privatekey = checksum_obj.encrypt(
        f"{username}:|:{password}",
        secret_key
    )
    print(f"[AIRPAY DEBUG] privatekey: {privatekey}")

    # Generate SHA256 key for checksum
    # Format: hash('SHA256', username.'~:~'.password)
    key_sha256 = checksum_obj.encrypt_sha256(f"{username}~:~{password}")
    print(f"[AIRPAY DEBUG] key_sha256: {key_sha256}")

    # Calculate checksum
    # Format: hash('SHA256', key.'@'.alldata.date)
    checksum_data = all_data + today
    print(f"[AIRPAY DEBUG] checksum_data (alldata+today): '{checksum_data}'")

    checksum = checksum_obj.calculate_checksum_sha256(checksum_data, key_sha256)
    print(f"[AIRPAY DEBUG] Final checksum: {checksum}")

    # Generate UID (unique user identifier) - AFTER checksum calculation
    # UID is sent as parameter but NOT included in simple transaction checksum
    uid = hashlib.sha256(f"{username}{order_id}{today}".encode('utf-8')).hexdigest()

    # Build request parameters (matching exact Airpay API documentation)
    payment_params = {
        'buyerEmail': buyer_email,
        'buyerPhone': buyer_phone,
        'buyerFirstName': buyer_first_name,
        'buyerLastName': buyer_last_name,
        'buyerAddress': buyer_address if buyer_address else '',
        'buyerCity': buyer_city if buyer_city else '',
        'buyerState': buyer_state if buyer_state else '',
        'buyerCountry': buyer_country if buyer_country else '',
        'buyerPinCode': buyer_pincode if buyer_pincode else '',
        'orderid': order_id,
        'amount': amount,
        'UID': uid,
        'privatekey': privatekey,
        'mercid': merchant_id,
        'kittype': 'inline',  # Required field - inline integration
        'checksum': checksum,
        'currency': currency,
        'isocurrency': iso_currency,
    }

    return payment_params


def validate_callback_response(
    response_data: Dict[str, str],
    merchant_id: str,
    username: str
) -> Dict[str, any]:
    """
    Validate and parse Airpay callback response

    Args:
        response_data: Form data from Airpay callback
        merchant_id: Airpay merchant ID
        username: Airpay username

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

    # Check for required fields
    required_fields = ['TRANSACTIONID', 'APTRANSACTIONID', 'AMOUNT',
                      'TRANSACTIONSTATUS', 'ap_SecureHash']

    missing_fields = []
    for field in required_fields:
        if not response_data.get(field):
            missing_fields.append(field)

    if missing_fields:
        result['error'] = f"Missing required fields: {', '.join(missing_fields)}"
        return result

    # Verify checksum
    checksum_obj = AirpayChecksum()
    is_valid, calculated_hash = checksum_obj.verify_response_checksum(
        response_data,
        merchant_id,
        username
    )

    if not is_valid:
        result['error'] = (
            f"Checksum verification failed. "
            f"Airpay hash: {response_data.get('ap_SecureHash')}, "
            f"Calculated hash: {calculated_hash}"
        )
        return result

    # Parse response data
    result['valid'] = True
    result['transaction_id'] = response_data.get('TRANSACTIONID')
    result['ap_transaction_id'] = response_data.get('APTRANSACTIONID')
    result['amount'] = response_data.get('AMOUNT')
    result['status'] = response_data.get('TRANSACTIONSTATUS')
    result['message'] = response_data.get('MESSAGE')
    result['custom_var'] = response_data.get('CUSTOMVAR', '')

    return result
