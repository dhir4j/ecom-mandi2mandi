# SabPaisa Payment Gateway Setup Guide

This guide explains how to set up and use the SabPaisa payment gateway integration in your Mandi2Mandi application.

## Overview

The application now supports **two payment gateways**:
1. **PayU** - Existing payment gateway
2. **SabPaisa** - New payment gateway integration

Users can select their preferred gateway during checkout.

## Prerequisites

- Python 3.8 or higher
- Flask backend running
- Access to SabPaisa merchant credentials

## Installation Steps

### 1. Install Python Dependencies

```bash
cd project
pip install -r requirements.txt
```

This will install `pycryptodome==3.20.0`, which is required for SabPaisa encryption.

### 2. Configure Environment Variables

Add the following SabPaisa credentials to your `.env` file:

#### For Stage/Testing Environment:
```env
SABPAISA_CLIENT_CODE=DJ020
SABPAISA_USERNAME=DJL754@sp
SABPAISA_PASSWORD=4q3qhgmJNM4m
SABPAISA_AUTH_KEY=ISTrmmDC2bTvkxzlDRrVguVwetGS8xC/UFPsp6w+Itg=
SABPAISA_AUTH_IV=M+aUFgRMPq7ci+Cmoytp3KJ2GPBOwO72Z2Cjbr55zY7++pT9mLES2M5cIblnBtaX
SABPAISA_BASE_URL=https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1
```

#### For Production Environment:
```env
SABPAISA_CLIENT_CODE=RKRM88
SABPAISA_USERNAME=info@mandi2mandi.com
SABPAISA_PASSWORD=RKRM88_SP24284
SABPAISA_AUTH_KEY=02sPLJl7wBKB/N/QS0u/CinEAWbXhSERS7xanaDhguU=
SABPAISA_AUTH_IV=E7kwjTIDcsQjKprRjGzZA/RdIhDfATdMaLuVcdnke4uBCP66ioxT70PKcqlGPOlc
SABPAISA_BASE_URL=https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit
```

### 3. Restart Backend Server

After updating environment variables:
```bash
cd project
python run.py
```

## How It Works

### User Flow

1. **Product Selection**: User selects a product and proceeds to checkout
2. **Gateway Selection**: User chooses between PayU or SabPaisa on the checkout page
3. **Payment Processing**: User is redirected to the selected gateway
4. **Callback**: After payment, user is redirected back to the application
5. **Order Confirmation**: Order status is updated based on payment result

### Technical Flow

#### PayU Flow (Existing)
```
Frontend → /api/initiate-payment (gateway=payu)
         → PayU Gateway
         → /api/payment-success or /api/payment-failure
         → Confirmation Page
```

#### SabPaisa Flow (New)
```
Frontend → /api/initiate-payment (gateway=sabpaisa)
         → Encrypt payment data with AES-256-CBC
         → SabPaisa Gateway
         → /api/sabpaisa-payment-success or /api/sabpaisa-payment-failure
         → Decrypt response
         → Confirmation Page
```

## API Endpoints

### Initiate Payment
**Endpoint**: `POST /api/initiate-payment`

**Request Body**:
```json
{
  "gateway": "sabpaisa",  // or "payu"
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
  "city": "Delhi",
  "state": "Delhi"
}
```

**Response (SabPaisa)**:
```json
{
  "gateway": "sabpaisa",
  "sabpaisa_url": "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1",
  "encData": "encrypted_base64_string",
  "clientCode": "DJ020",
  "checksum": "sha256_hash"
}
```

### SabPaisa Callbacks

#### Success Callback
**Endpoint**: `POST /api/sabpaisa-payment-success`

**Process**:
1. Receive encrypted response from SabPaisa
2. Decrypt using AES-256-CBC
3. Verify payment status
4. Update order status to 'Booked'
5. Redirect to confirmation page

#### Failure Callback
**Endpoint**: `POST /api/sabpaisa-payment-failure`

**Process**:
1. Receive encrypted response (if available)
2. Update order status to 'Failed'
3. Redirect to failure page

## Security Features

### SabPaisa Security

1. **AES-256-CBC Encryption**: All payment data is encrypted before sending
2. **Checksum Verification**: SHA-256 checksum prevents tampering
3. **Secure Callbacks**: Response data is encrypted and verified
4. **HTTPS Only**: All transactions use SSL/TLS

### PayU Security (Existing)

1. **SHA-512 Hash**: Payment data integrity verification
2. **Hash Verification**: Callback responses are verified
3. **HTTPS Only**: Secure communication

## Testing

### SabPaisa Test Environment

Use the stage credentials provided above.

**Test Card Details**: Refer to SabPaisa documentation at https://developer.sabpaisa.in/docs/testing/

### PayU Test Environment

Use existing test credentials for PayU.

## File Structure

```
project/
├── api/
│   ├── payments.py          # Main payment endpoints
│   ├── sabpaisa_utils.py    # SabPaisa encryption utilities
│   └── models.py            # Database models
├── config.py                # Configuration (includes SabPaisa config)
└── requirements.txt         # Python dependencies

src/
└── components/
    └── checkout-client-page.tsx  # Frontend checkout with gateway selection
```

## Key Features

### Frontend Features

1. **Gateway Selection UI**: Clean, user-friendly selection between PayU and SabPaisa
2. **Dynamic Redirection**: Automatically redirects to selected gateway
3. **Loading States**: Shows processing state during payment initiation
4. **Error Handling**: Graceful error messages for failed payments

### Backend Features

1. **Dual Gateway Support**: Seamlessly handles both PayU and SabPaisa
2. **Encryption/Decryption**: Automatic AES-256 encryption for SabPaisa
3. **Status Tracking**: Updates order status based on payment results
4. **Error Recovery**: Handles various error scenarios

## Troubleshooting

### Issue: "Module 'Crypto' not found"
**Solution**: Install pycryptodome: `pip install pycryptodome==3.20.0`

### Issue: "Invalid encryption key"
**Solution**: Verify AUTH_KEY and AUTH_IV are correctly copied from SabPaisa dashboard (including Base64 encoding)

### Issue: "Payment fails with checksum error"
**Solution**: Ensure client code, transaction ID, and amount are exactly as sent in the request

### Issue: "Callback not received"
**Solution**: Verify callback URLs are accessible from SabPaisa servers (no localhost, use public URLs)

## Production Checklist

Before going live with SabPaisa:

- [ ] Update `.env` with production credentials
- [ ] Change `SABPAISA_BASE_URL` to production URL
- [ ] Test end-to-end payment flow with small amount
- [ ] Verify callbacks are working correctly
- [ ] Test both success and failure scenarios
- [ ] Enable logging for payment transactions
- [ ] Set up monitoring for payment failures
- [ ] Backup existing PayU configuration
- [ ] Update SabPaisa dashboard with correct callback URLs

## Support

### SabPaisa Documentation
- Developer Docs: https://developer.sabpaisa.in/docs/python/
- Next.js Integration: https://developer.sabpaisa.in/docs/next-js/

### Contact
For technical support:
- SabPaisa Support: Check your merchant dashboard
- Application Issues: Contact your development team

## Notes

1. **Backward Compatibility**: PayU remains the default gateway if no selection is made
2. **Database**: No schema changes required - both gateways use same Order model
3. **Transaction IDs**: UUIDs are generated for all transactions
4. **Multiple Gateways**: Both gateways can be active simultaneously
5. **User Choice**: Users can freely choose their preferred gateway at checkout
