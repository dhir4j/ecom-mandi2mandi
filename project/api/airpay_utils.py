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
    today = datetime.now().strftime("%Y-%m-%d")

    # Build data string for checksum (order matters!)
    # Based on sendtoairpay.py logic
    if buyer_address and buyer_city and buyer_state and buyer_country:
        all_data = (
            buyer_email + buyer_first_name + buyer_last_name +
            buyer_address + buyer_city + buyer_state + buyer_country +
            amount + order_id
        )
    else:
        all_data = (
            buyer_email + buyer_first_name + buyer_last_name +
            amount + order_id
        )

    # Generate privatekey using encryption
    checksum_obj = AirpayChecksum()
    privatekey = checksum_obj.encrypt(
        f"{username}:|:{password}",
        secret_key
    )

    # Generate SHA256 key for checksum
    key_sha256 = checksum_obj.encrypt_sha256(f"{username}~:~{password}")

    # Calculate checksum
    checksum = checksum_obj.calculate_checksum_sha256(all_data + today, key_sha256)

    # Build request parameters
    payment_params = {
        'privatekey': privatekey,
        'mercid': merchant_id,
        'orderid': order_id,
        'currency': currency,
        'isocurrency': iso_currency,
        'checksum': checksum,
        'buyerEmail': buyer_email,
        'buyerPhone': buyer_phone,
        'buyerFirstName': buyer_first_name,
        'buyerLastName': buyer_last_name,
        'buyerAddress': buyer_address,
        'buyerCity': buyer_city,
        'buyerState': buyer_state,
        'buyerCountry': buyer_country,
        'buyerPinCode': buyer_pincode,
        'amount': amount,
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
