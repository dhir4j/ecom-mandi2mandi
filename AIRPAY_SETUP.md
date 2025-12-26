# Airpay Payment Gateway Setup Guide

This guide explains how to set up and use the Airpay payment gateway integration in your Mandi2Mandi application.

## Overview

The application now supports **three payment gateways**:
1. **PayU** - Existing payment gateway
2. **SabPaisa** - Existing payment gateway
3. **Airpay** - New payment gateway integration

Users can select their preferred gateway during checkout.

## Prerequisites

- Python 3.8 or higher
- Flask backend running
- Access to Airpay merchant credentials
- Valid Airpay merchant account

## Airpay Credentials

**Credentials Location**: `.credentials/AIRPAY_CREDENTIALS.txt`

> ⚠️ **Security Note**: All payment gateway credentials are stored in the `.credentials/` folder which is gitignored. Never commit this folder to version control.

To access your Airpay credentials:
1. Open `.credentials/AIRPAY_CREDENTIALS.txt`
2. Copy the values to your production `.env` file
3. Never hardcode credentials in source code

## Installation Steps

### 1. Configure Environment Variables

Get credentials from `.credentials/AIRPAY_CREDENTIALS.txt` and add to your `.env` file:

```env
# Airpay Payment Gateway Configuration
# Get actual values from .credentials/AIRPAY_CREDENTIALS.txt
AIRPAY_MERCHANT_ID=<your_merchant_id>
AIRPAY_USERNAME=<your_username>
AIRPAY_PASSWORD=<your_password>
AIRPAY_SECRET_KEY=<your_secret_key>
AIRPAY_BASE_URL=https://payments.airpay.co.in/pay/index.php
```

> 💡 **Tip**: Copy the "Environment Variables Format" section from `.credentials/AIRPAY_CREDENTIALS.txt` directly to your `.env` file.

### 2. Restart Backend Server

After updating environment variables:
```bash
cd project
python run.py
```

## How It Works

### User Flow

1. **Product Selection**: User selects a product and proceeds to checkout
2. **Gateway Selection**: User chooses between PayU, SabPaisa, or Airpay on the checkout page
3. **Payment Processing**: User is redirected to the selected gateway
4. **Callback**: After payment, user is redirected back to the application
5. **Order Confirmation**: Order status is updated based on payment result

### Technical Flow

```
Frontend → /api/initiate-payment (gateway=airpay)
         → Generate SHA256 checksum
         → Airpay Gateway
         → /api/airpay-payment-success or /api/airpay-payment-failure
         → Verify CRC32 checksum
         → Confirmation Page
```

## API Endpoints

### Initiate Payment
**Endpoint**: `POST /api/initiate-payment`

**Request Body**:
```json
{
  "gateway": "airpay",
  "amount": 1000.00,
  "productName": "Product Name",
  "quantity": 10,
  "unit": "kg",
  "totalPrice": 1000.00,
  "paymentOption": "full",
  "buyerName": "John Doe",
  "mobile": "9876543210",
  "pincode": "110001",
  "addressLine1": "123 Street",
  "addressLine2": "Near Landmark",
  "city": "Delhi",
  "state": "Delhi"
}
```

**Response (Airpay)**:
```json
{
  "gateway": "airpay",
  "airpay_url": "https://payments.airpay.co.in/pay/index.php",
  "privatekey": "sha256_encrypted_credentials",
  "mercid": "351531",
  "orderid": "transaction_uuid",
  "currency": "356",
  "isocurrency": "INR",
  "checksum": "sha256_checksum",
  "buyerEmail": "user@example.com",
  "buyerPhone": "9876543210",
  "buyerFirstName": "John",
  "buyerLastName": "Doe",
  "buyerAddress": "123 Street",
  "buyerCity": "Delhi",
  "buyerState": "Delhi",
  "buyerCountry": "India",
  "buyerPinCode": "110001",
  "amount": "1000.00"
}
```

### Airpay Callbacks

#### Success Callback
**Endpoint**: `POST /api/airpay-payment-success`

**Process**:
1. Receive response data from Airpay
2. Validate using CRC32 checksum
3. Verify payment status (200 = SUCCESS)
4. Update order status to 'Booked'
5. Redirect to confirmation page

**Expected Parameters from Airpay**:
- `TRANSACTIONID`: Merchant transaction ID
- `APTRANSACTIONID`: Airpay transaction ID
- `AMOUNT`: Transaction amount
- `TRANSACTIONSTATUS`: Status code (200 = success)
- `MESSAGE`: Status message
- `ap_SecureHash`: CRC32 checksum
- `CUSTOMVAR`: Custom variables (optional)

#### Failure Callback
**Endpoint**: `POST /api/airpay-payment-failure`

**Process**:
1. Receive response data from Airpay
2. Update order status to 'Failed'
3. Redirect to failure page

## Security Features

### Airpay Security

1. **SHA256 Encryption**: Credentials are encrypted using SHA256
2. **Checksum Verification**: SHA256 checksum for request data integrity
3. **CRC32 Response Validation**: All callback responses verified using CRC32 checksum
4. **HTTPS Only**: All transactions use SSL/TLS
5. **Privatekey Generation**: Dynamic privatekey generated for each transaction

### Encryption Process

**Request Encryption**:
```python
# Generate privatekey
privatekey = SHA256(secret_key + '@' + username + ':|:' + password)

# Generate SHA256 key for checksum
key_sha256 = SHA256(username + '~:~' + password)

# Calculate checksum
checksum = SHA256(key_sha256 + '@' + payment_data + current_date)
```

**Response Verification**:
```python
# Build CRC data string
crc_data = f"{TRANSACTIONID}:{APTRANSACTIONID}:{AMOUNT}:{TRANSACTIONSTATUS}:{MESSAGE}:{MERCID}:{USERNAME}"

# Calculate CRC32 checksum
merchant_hash = CRC32(crc_data)

# Verify against Airpay's hash
is_valid = (ap_SecureHash == merchant_hash)
```

## Testing

### Airpay Test Environment

Use the production credentials provided above. Airpay typically provides test cards for testing:

**Test Transaction Flow**:
1. Use the checkout page with Airpay gateway selected
2. Enter valid buyer information
3. Complete payment on Airpay's page
4. Verify callback is received
5. Check order status in database

**Important Notes**:
- Airpay uses currency code `356` for INR
- Transaction status `200` indicates success
- All amounts should be in format `XXXX.XX` (2 decimal places)
- Date format for checksum: `YYYY-MM-DD`

## File Structure

```
project/
├── api/
│   ├── payments.py          # Main payment endpoints (includes Airpay)
│   ├── airpay_utils.py      # Airpay encryption utilities
│   ├── sabpaisa_utils.py    # SabPaisa encryption utilities
│   └── models.py            # Database models
├── config.py                # Configuration (includes Airpay config)
└── requirements.txt         # Python dependencies

src/
└── components/
    └── checkout-client-page.tsx  # Frontend checkout with 3 gateway options
```

## Key Features

### Frontend Features

1. **Three Gateway Selection UI**: Clean, user-friendly selection between PayU, SabPaisa, and Airpay
2. **Dynamic Redirection**: Automatically redirects to selected gateway
3. **Loading States**: Shows processing state during payment initiation
4. **Error Handling**: Graceful error messages for failed payments

### Backend Features

1. **Triple Gateway Support**: Seamlessly handles PayU, SabPaisa, and Airpay
2. **Encryption/Decryption**: Automatic SHA256 encryption for Airpay
3. **Status Tracking**: Updates order status based on payment results
4. **Error Recovery**: Handles various error scenarios
5. **Checksum Validation**: CRC32 verification for callbacks

## Troubleshooting

### Issue: "Invalid checksum error"
**Solution**: Verify that:
- Merchant ID, username, and password are correct
- Transaction date format is `YYYY-MM-DD`
- All data fields are concatenated in correct order
- No extra spaces in data fields

### Issue: "Callback not received"
**Solution**:
- Verify callback URLs are accessible from Airpay servers (no localhost, use public URLs)
- Check Flask backend logs for incoming requests
- Ensure POST method is allowed for callback endpoints

### Issue: "Payment fails immediately"
**Solution**:
- Check if buyer details are valid (email, phone, address)
- Verify amount format is correct (2 decimal places)
- Ensure all required fields are provided

### Issue: "Checksum validation failed on callback"
**Solution**:
- Ensure merchant ID and username match config
- Verify CRC32 calculation includes all required fields
- Check if field order matches Airpay specification

## Production Checklist

Before going live with Airpay:

- [x] Update `.env` with production credentials (already configured)
- [x] Airpay base URL is set to production
- [ ] Test end-to-end payment flow with real amount
- [ ] Verify callbacks are working correctly
- [ ] Test both success and failure scenarios
- [ ] Enable logging for payment transactions
- [ ] Set up monitoring for payment failures
- [ ] Update Airpay dashboard with correct callback URLs:
  - Success URL: `https://www.mandi.ramhotravels.com/api/airpay-payment-success`
  - Failure URL: `https://www.mandi.ramhotravels.com/api/airpay-payment-failure`

## Callback URL Configuration

Configure these URLs in your Airpay merchant dashboard:

**Success URL**:
```
https://www.mandi.ramhotravels.com/api/airpay-payment-success
```

**Failure URL**:
```
https://www.mandi.ramhotravels.com/api/airpay-payment-failure
```

## Airpay Response Codes

| Status Code | Description |
|------------|-------------|
| 200 | Transaction Successful |
| 300 | Transaction Failed |
| 400 | Transaction Pending |
| 999 | Transaction Error |

## Support

### Airpay Documentation
- Developer Portal: https://www.airpay.co.in/
- Support Email: operations@airpay.co.in
- Technical Support: tech@airpay.co.in

### Contact
For technical support:
- Airpay Support: Check your merchant dashboard
- Application Issues: Contact your development team

## Notes

1. **Backward Compatibility**: PayU remains the default gateway if no selection is made
2. **Database**: No schema changes required - all gateways use same Order model
3. **Transaction IDs**: UUIDs are generated for all transactions
4. **Multiple Gateways**: All three gateways can be active simultaneously
5. **User Choice**: Users can freely choose their preferred gateway at checkout
6. **Currency**: Airpay uses ISO currency code 356 for Indian Rupees (INR)
7. **Date Format**: All checksums use current date in YYYY-MM-DD format

## Comparison with Other Gateways

| Feature | PayU | SabPaisa | Airpay |
|---------|------|----------|--------|
| Encryption | SHA-512 | AES-256-GCM | SHA-256 |
| Checksum | SHA-512 | HMAC-SHA384 | SHA-256 + CRC32 |
| Response Validation | Hash verification | HMAC + Tag | CRC32 checksum |
| Integration Complexity | Medium | High | Medium |
| Documentation | Excellent | Good | Good |

## Implementation Details

### Python Dependencies
No additional dependencies required. Uses built-in Python modules:
- `hashlib` for SHA256 encryption
- `zlib` for CRC32 checksum
- `datetime` for date handling

### Frontend Dependencies
No additional dependencies required. Uses existing Next.js and React setup.

## Next Steps

1. Configure callback URLs in Airpay merchant dashboard
2. Test the complete payment flow
3. Monitor transaction logs
4. Verify order status updates correctly
5. Test error scenarios (declined cards, timeout, etc.)

## References

- Airpay SDK Documentation: Check with your Airpay account manager
- Implementation based on: Airpay Python SDK v3.0.0
- CRC32 Reference: https://docs.python.org/3/library/zlib.html#zlib.crc32
- SHA256 Reference: https://docs.python.org/3/library/hashlib.html
