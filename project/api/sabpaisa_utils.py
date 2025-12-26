"""
SabPaisa Payment Gateway Integration Utilities
Based on official SabPaisa Python reference implementation
Uses AES-256-GCM with HMAC-SHA384
"""
import base64
import os
import hmac
import hashlib
from Crypto.Cipher import AES
from datetime import datetime


class AES256HMACSHA384HEX:
    """
    Official SabPaisa encryption class
    Uses AES-256-GCM mode with HMAC-SHA384 authentication
    """
    IV_SIZE = 12  # GCM uses 12-byte nonce
    TAG_SIZE = 16  # GCM authentication tag size
    HMAC_LENGTH = 48  # SHA384 produces 48 bytes

    def __init__(self, auth_key: str, auth_iv: str):
        """
        Initialize encryption with SabPaisa credentials

        Args:
            auth_key: Base64 encoded authentication key
            auth_iv: Base64 encoded authentication IV (used for HMAC)
        """
        auth_key = auth_key.strip()
        auth_iv = auth_iv.strip()

        self.auth_key = base64.b64decode(auth_key)
        self.auth_iv = base64.b64decode(auth_iv)

    @staticmethod
    def bytes_to_hex(b: bytes) -> str:
        """Convert bytes to uppercase hex string"""
        return b.hex().upper()

    @staticmethod
    def hex_to_bytes(h: str) -> bytes:
        """Convert hex string to bytes"""
        return bytes.fromhex(h)

    def encrypt(self, plaintext: str) -> str:
        """
        Encrypt plaintext using AES-256-GCM + HMAC-SHA384

        Args:
            plaintext: Data to encrypt

        Returns:
            Hex encoded encrypted string (uppercase)
        """
        # Generate random 12-byte IV for GCM
        iv = os.urandom(self.IV_SIZE)

        # Create AES-GCM cipher
        cipher = AES.new(self.auth_key, AES.MODE_GCM, nonce=iv, mac_len=self.TAG_SIZE)

        # Encrypt and get authentication tag
        ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))

        # Combine: IV + ciphertext + tag
        encrypted_message = iv + ciphertext + tag

        # Calculate HMAC-SHA384 over encrypted message
        hmac_calculated = hmac.new(self.auth_iv, encrypted_message, hashlib.sha384).digest()

        # Final message: HMAC + encrypted_message
        final_message = hmac_calculated + encrypted_message

        # Return as uppercase hex
        return self.bytes_to_hex(final_message)

    def decrypt(self, hex_ciphertext: str) -> str:
        """
        Decrypt SabPaisa response

        Args:
            hex_ciphertext: Hex encrypted response from SabPaisa

        Returns:
            Decrypted plaintext
        """
        full_message = self.hex_to_bytes(hex_ciphertext)

        if len(full_message) < self.HMAC_LENGTH + self.IV_SIZE + self.TAG_SIZE:
            raise ValueError("Invalid ciphertext length")

        # Extract HMAC and encrypted data
        hmac_received = full_message[:self.HMAC_LENGTH]
        encrypted_data = full_message[self.HMAC_LENGTH:]

        # Verify HMAC
        hmac_calculated = hmac.new(self.auth_iv, encrypted_data, hashlib.sha384).digest()
        if not hmac.compare_digest(hmac_received, hmac_calculated):
            raise ValueError("HMAC validation failed. Data may be tampered!")

        # Extract IV, ciphertext, and tag
        iv = encrypted_data[:self.IV_SIZE]
        ciphertext_with_tag = encrypted_data[self.IV_SIZE:]
        ciphertext = ciphertext_with_tag[:-self.TAG_SIZE]
        tag = ciphertext_with_tag[-self.TAG_SIZE:]

        # Decrypt
        cipher = AES.new(self.auth_key, AES.MODE_GCM, nonce=iv, mac_len=self.TAG_SIZE)
        plaintext_bytes = cipher.decrypt_and_verify(ciphertext, tag)

        return plaintext_bytes.decode('utf-8')


def build_payment_request(
    payer_name: str,
    payer_email: str,
    payer_mobile: str,
    client_txn_id: str,
    amount: float,
    client_code: str,
    trans_username: str,
    trans_password: str,
    callback_url: str,
    amount_type: str = "INR",
    channel_id: str = "W",
    **optional_params
) -> str:
    """
    Build parameter string for SabPaisa (matches official implementation)

    NOTE: Official code does NOT include mcc, transDate, payerAddress
    """
    # Build the parameter string exactly as official implementation
    params_str = (
        f"payerName={payer_name.strip()}"
        f"&payerEmail={payer_email.strip()}"
        f"&payerMobile={payer_mobile.strip()}"
        f"&clientTxnId={client_txn_id.strip()}"
        f"&amount={amount}"
        f"&clientCode={client_code.strip()}"
        f"&transUserName={trans_username.strip()}"
        f"&transUserPassword={trans_password.strip()}"
        f"&callbackUrl={callback_url.strip()}"
        f"&amountType={amount_type}"
        f"&channelId={channel_id}"
    )

    # Add optional UDF fields
    for i in range(1, 21):
        udf_key = f"udf{i}"
        if optional_params.get(udf_key):
            params_str += f"&{udf_key}={optional_params[udf_key]}"

    return params_str


def create_encrypted_request(params_str: str, auth_key: str, auth_iv: str) -> str:
    """
    Encrypt payment request using official SabPaisa encryption
    """
    crypto = AES256HMACSHA384HEX(auth_key, auth_iv)
    return crypto.encrypt(params_str).strip()


def parse_callback_response(enc_response: str, auth_key: str, auth_iv: str) -> dict:
    """
    Decrypt and parse SabPaisa callback response
    """
    try:
        crypto = AES256HMACSHA384HEX(auth_key, auth_iv)
        decrypted = crypto.decrypt(enc_response.strip())

        response_dict = {}
        for pair in decrypted.split("&"):
            if "=" in pair:
                key, value = pair.split("=", 1)
                response_dict[key] = value

        return response_dict
    except Exception as e:
        raise Exception(f"Failed to parse callback: {str(e)}")
