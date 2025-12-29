# Airpay V4 Configuration Guide

This document explains how to configure Airpay V4 payment gateway for the Mandi2Mandi application.

## Overview

The application has been updated to use **Airpay V4 API** which includes:
- OAuth2 authentication for enhanced security
- AES-CBC encryption for request/response data
- Improved checksum calculation
- Support for both regular and subscription payments

## Required Credentials

You need to obtain the following credentials from Airpay:

1. **AIRPAY_MERCHANT_ID** - Your Airpay merchant ID
2. **AIRPAY_USERNAME** - Your Airpay username
3. **AIRPAY_PASSWORD** - Your Airpay password
4. **AIRPAY_SECRET_KEY** - Your Airpay secret key
5. **AIRPAY_CLIENT_ID** - OAuth2 client ID (new for V4)
6. **AIRPAY_CLIENT_SECRET** - OAuth2 client secret (new for V4)

## Environment Variables Setup

Add the following variables to your `.env` file:

```bash
# Airpay V4 Credentials
AIRPAY_MERCHANT_ID=your_merchant_id
AIRPAY_USERNAME=your_username
AIRPAY_PASSWORD=your_password
AIRPAY_SECRET_KEY=your_secret_key
AIRPAY_CLIENT_ID=your_client_id
AIRPAY_CLIENT_SECRET=your_client_secret

# Airpay V4 API URLs (optional - defaults are already set)
AIRPAY_BASE_URL=https://payments.airpay.co.in/pay/v4/index.php
AIRPAY_OAUTH_URL=https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/
```

## How It Works

### Payment Initiation Flow

1. **OAuth2 Token Request**
   - Application requests an OAuth2 access token from Airpay
   - Request is encrypted using AES-CBC with MD5(username~:~password) as key
   - Checksum is calculated on sorted request parameters + date

2. **Payment Request**
   - Payment data is encrypted using AES-CBC
   - Form is auto-submitted to Airpay with encrypted data
   - Access token is appended to the payment URL

3. **Callback Handling**
   - Airpay sends encrypted response via POST
   - Application decrypts the response
   - Checksum is verified using CRC32
   - Order status is updated in database

### Supported Payment Types

1. **Regular Payments** (`/api/initiate-payment`)
   - Product orders with full buyer details
   - Gateway selection: `airpay`

2. **Subscription Payments** (`/api/get-payu-hash`)
   - Recurring subscription payments
   - Gateway selection: `airpay`

### Callback URLs

The following callback endpoints handle Airpay V4 responses:

- **Regular Payment Success**: `/api/airpay-payment-success`
- **Regular Payment Failure**: `/api/airpay-payment-failure`
- **Subscription Success**: `/api/airpay-subscription-success`
- **Subscription Failure**: `/api/airpay-subscription-failure`

**Important**: Make sure these URLs are whitelisted in your Airpay merchant account:
- `https://www.mandi.ramhotravels.com/api/airpay-payment-success`
- `https://www.mandi.ramhotravels.com/api/airpay-payment-failure`
- `https://www.mandi.ramhotravels.com/api/airpay-subscription-success`
- `https://www.mandi.ramhotravels.com/api/airpay-subscription-failure`

## Dependencies

The following Python packages are required (already in requirements.txt):

```
pycryptodome==3.20.0  # For AES encryption/decryption
requests==2.31.0      # For OAuth2 token request
```

Install dependencies:
```bash
pip install -r project/requirements.txt
```

## Testing

You can test the Airpay integration:

1. **Test Payment Initiation**
   - Navigate to the product order page
   - Select "Airpay" as payment gateway
   - Fill in buyer details and submit

2. **Test Subscription Payment**
   - Navigate to subscription page
   - Select "Airpay" as payment method
   - Complete the payment flow

3. **Check Logs**
   - Look for `[AIRPAY V4 DEBUG]` messages in application logs
   - Verify OAuth2 token generation
   - Verify encryption and checksum calculations

## Troubleshooting

### Common Issues

1. **"Failed to get OAuth2 access token"**
   - Check CLIENT_ID and CLIENT_SECRET are correct
   - Verify merchant credentials (username, password)
   - Check network connectivity to Airpay OAuth server

2. **"Checksum verification failed"**
   - Ensure SECRET_KEY is correct
   - Verify all credentials match your Airpay account
   - Check date/time synchronization on server

3. **"Invalid response" or decryption errors**
   - Verify USERNAME and PASSWORD are correct
   - Check encryption key generation
   - Review Airpay response format

### Debug Mode

Enable detailed logging by checking application logs for:
- `[AIRPAY V4 DEBUG]` - Normal flow messages
- `[AIRPAY V4 ERROR]` - Error messages

## Migration from Previous Version

If you were using an older version of Airpay integration:

1. Add the new OAuth2 credentials to your `.env` file
2. Update the AIRPAY_BASE_URL to V4 endpoint
3. No changes needed in frontend code
4. The callback URLs remain the same (no frontend changes needed)

## Security Notes

1. **Never commit credentials** to version control
2. Use environment variables for all sensitive data
3. Keep `.env` file in `.gitignore`
4. Rotate credentials periodically
5. Monitor callback endpoints for suspicious activity

## Support

For Airpay V4 API issues:
- Contact Airpay technical support
- Reference: Airpay Python SDK v4.0.0
- Check airpay_python_v4/ folder for reference implementation

For application-specific issues:
- Check application logs
- Review `project/api/airpay_utils.py` for implementation
- Review `project/api/payments.py` for endpoint logic
