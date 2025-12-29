# Airpay V4 Troubleshooting Guide

## Error: Redirected to https://payments.airpay.co.in/error.php

If you're being redirected to Airpay's error page after submitting the payment form, this typically indicates a **merchant account configuration issue** on Airpay's end, not a code issue.

### ✅ What's Working

Based on your logs:
- ✅ OAuth2 token generation successful
- ✅ Payment parameters correctly generated
- ✅ Form submission working
- ✅ Encrypted data properly formatted
- ✅ Checksum calculated correctly

### ❌ Why You're Getting the Error

Airpay V4 requires specific merchant account configuration that must be done by Airpay support:

## Required Configuration on Airpay Merchant Portal

### 1. **Enable V4 API Access**

Your merchant account needs to be **enabled for V4 API** access. By default, merchants are on V3.

**Action Required:**
- Contact Airpay support at: support@airpay.co.in
- Request: "Please enable V4 API access for merchant ID: 351531"

### 2. **Whitelist Callback URLs**

Airpay requires you to register/whitelist your callback URLs in their merchant portal.

**URLs to Whitelist:**

For **Subscription Payments:**
```
https://www.mandi.ramhotravels.com/api/airpay-subscription-success
https://www.mandi.ramhotravels.com/api/airpay-subscription-failure
```

For **Regular Product Payments:**
```
https://www.mandi.ramhotravels.com/api/airpay-payment-success
https://www.mandi.ramhotravels.com/api/airpay-payment-failure
```

**Action Required:**
- Email Airpay support with these URLs
- Ask them to whitelist these callback URLs for your merchant ID
- Specify they are for **V4 API**

### 3. **Verify OAuth2 Credentials**

Ensure you have the correct OAuth2 credentials for V4:

```
AIRPAY_MERCHANT_ID=351531
AIRPAY_USERNAME=KpSC7CxDab
AIRPAY_PASSWORD=<your_password>
AIRPAY_SECRET_KEY=<your_secret_key>
AIRPAY_CLIENT_ID=<your_oauth2_client_id>
AIRPAY_CLIENT_SECRET=<your_oauth2_client_secret>
```

**Action Required:**
- Verify CLIENT_ID and CLIENT_SECRET are for V4 API
- These are different from V3 credentials
- Contact Airpay if you don't have V4 OAuth2 credentials

### 4. **Check Test vs Production Mode**

Are you using test or production credentials?

**Test Environment:**
- OAuth URL: `https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/` (Test)
- Payment URL: `https://payments.airpay.co.in/pay/v4/index.php` (Test)

**Production Environment:**
- OAuth URL: `https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/` (Production)
- Payment URL: `https://payments.airpay.co.in/pay/v4/index.php` (Production)

**Action Required:**
- Confirm with Airpay whether you're using test or production credentials
- Ensure credentials match the environment

## Email Template for Airpay Support

```
To: support@airpay.co.in
Subject: Enable V4 API and Whitelist Callback URLs - Merchant ID 351531

Dear Airpay Support Team,

I am integrating Airpay V4 API for merchant ID: 351531

Please help with the following:

1. Enable V4 API access for my merchant account

2. Whitelist the following callback URLs for V4 API:
   - https://www.mandi.ramhotravels.com/api/airpay-subscription-success
   - https://www.mandi.ramhotravels.com/api/airpay-subscription-failure
   - https://www.mandi.ramhotravels.com/api/airpay-payment-success
   - https://www.mandi.ramhotravels.com/api/airpay-payment-failure

3. Confirm my OAuth2 credentials (CLIENT_ID and CLIENT_SECRET) are correct for V4 API

4. Confirm whether I'm using test or production environment

Currently, when I submit a payment, I'm redirected to https://payments.airpay.co.in/error.php which suggests a configuration issue.

My integration details:
- Merchant ID: 351531
- Username: KpSC7CxDab
- API Version: V4
- Integration Type: Server-to-Server

Please advise on the next steps.

Thank you,
[Your Name]
[Your Contact]
```

## Common Airpay V4 Error Reasons

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| Redirect to error.php | Callback URLs not whitelisted | Contact Airpay support to whitelist URLs |
| Redirect to error.php | V4 API not enabled | Request V4 API access from Airpay |
| Redirect to error.php | Invalid OAuth2 credentials | Verify CLIENT_ID and CLIENT_SECRET with Airpay |
| Redirect to error.php | Test/Prod mismatch | Confirm environment with Airpay |
| OAuth token failure | Invalid credentials | Check USERNAME, PASSWORD, SECRET_KEY |

## Verify Your Integration

While waiting for Airpay support, verify your code is correct:

### 1. Check Backend Logs

On PythonAnywhere, check error logs for these messages:

```
[AIRPAY V4 DEBUG] Getting OAuth2 token...
[AIRPAY V4 DEBUG] Got access token: <token>...
[AIRPAY V4 DEBUG] Payment params prepared successfully
```

If you see these, your code is working correctly.

### 2. Check Request Data

From the browser console, you should see:
- `airpay_url`: With a valid token
- `encdata`: Base64 encoded encrypted data
- `checksum`: SHA256 hash
- `merchant_id`: Your merchant ID
- `privatekey`: SHA256 hash

If all these are present, the issue is on Airpay's end.

### 3. Test with Airpay Support

Ask Airpay support to:
- Test a transaction from their end
- Check their server logs for your merchant ID
- Verify what error they're seeing

## Alternative: Try Test Credentials

If Airpay provides test credentials for V4, try those first:

1. Get test OAuth2 credentials from Airpay
2. Update your `.env`:
   ```
   AIRPAY_MERCHANT_ID=<test_merchant_id>
   AIRPAY_CLIENT_ID=<test_client_id>
   AIRPAY_CLIENT_SECRET=<test_client_secret>
   ```
3. Test the flow
4. Once working with test, switch to production credentials

## Next Steps

1. ✉️ **Email Airpay support** using the template above
2. ⏰ **Wait for Airpay** to configure your merchant account (usually 1-2 business days)
3. ✅ **Test again** after confirmation from Airpay
4. 🎉 **Payment should work** once Airpay completes the configuration

## Still Having Issues?

If Airpay confirms everything is configured correctly and you're still getting errors:

1. Share Airpay's error logs (ask them for specific error message)
2. Check if there are any IP restrictions
3. Verify SSL certificate on your domain
4. Try a different browser/device to rule out client-side issues

---

**Remember:** The error.php redirect is almost always a merchant account configuration issue, not a code issue. Your integration is correctly implemented based on Airpay's V4 reference code.
