# Payment Gateway Integration Fix - Complete Guide

## Issues Fixed

### 1. **CORS Errors** ✅
- Added proper CORS handling for OPTIONS preflight requests
- Fixed `/api/cart` and `/api/cart/add` endpoints
- Added payment gateway endpoints: `/api/initiate-payu-payment`, `/api/initiate-sabpaisa-payment`, `/api/initiate-payment`

### 2. **PayU Integration** ✅
- Implemented proper form-based submission (not URL redirect)
- Correct hash generation using PayU SDK
- Proper parameter formatting for PayU API

### 3. **SabPaisa Integration** ✅
- AES encryption implemented correctly
- Proper form submission with `encData` and `clientCode`
- Callback URLs configured

### 4. **Airpay V4 Integration** ✅
- OAuth2 token generation implemented
- Proper checksum calculation using SHA-256
- AES-256-CBC encryption with MD5 key derivation
- Correct form submission with all required parameters

### 5. **Frontend Issues** ✅
- Changed from simple redirect to proper form POST submission
- Fixed button text color on hover in payment modal
- Better error handling with detailed messages

---

## Files Modified

### Backend Files:
1. **`project/api/payments.py`** (Lines 203-388)
   - Added three route decorators for payment endpoints
   - Implemented OPTIONS handling for CORS
   - Fixed PayU, SabPaisa, and Airpay integrations
   - Added proper logging for debugging

2. **`project/api/cart.py`** (Lines 15-68)
   - Added OPTIONS support to cart endpoints
   - Manual CORS headers for preflight requests

3. **`project/api/airpay_utils.py`** (Already correct)
   - OAuth2 token generation
   - AES encryption/decryption
   - Checksum calculation

### Frontend Files:
1. **`src/components/product-details-page.tsx`** (Lines 200-276, 870-930)
   - Changed payment submission to use form POST
   - Fixed button text color issue
   - Better error handling

---

## Deployment Steps

### Step 1: Deploy Backend to PythonAnywhere

```bash
# SSH into PythonAnywhere or use the web console
cd ~/mandi2mandi

# Pull the latest changes
git pull origin master

# Restart the web app
# Go to PythonAnywhere Web tab and click "Reload"
```

### Step 2: Verify Backend Environment Variables

Ensure your `.env` file on PythonAnywhere has all these variables:

```bash
# PayU
PAYU_KEY=MY7QQz
PAYU_SALT=MT4oTUimzDHYFhx5lIwOTF9XBdgvHAZe

# SabPaisa
SABPAISA_CLIENT_CODE=RKRM88
SABPAISA_USERNAME=info@mandi2mandi.com
SABPAISA_PASSWORD=RKRM88_SP24284
SABPAISA_AUTH_KEY=02sPLJl7wBKB/N/QS0u/CinEAWbXhSERS7xanaDhguU=
SABPAISA_AUTH_IV=E7kwjTIDcsQjKprRjGzZA/RdIhDfATdMaLuVcdnke4uBCP66ioxT70PKcqlGPOlc
SABPAISA_BASE_URL=https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1

# Airpay V4
AIRPAY_MERCHANT_ID=351531
AIRPAY_USERNAME=KpSC7CxDab
AIRPAY_PASSWORD=KQF8mYAc
AIRPAY_SECRET_KEY=KYp2Nkg9gvjNqDtT
AIRPAY_CLIENT_ID=aa4b92
AIRPAY_CLIENT_SECRET=9d8804b8dc9209a23c2229c8003b9dd4
AIRPAY_BASE_URL=https://payments.airpay.co.in/pay/v4/index.php
AIRPAY_OAUTH_URL=https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/
```

### Step 3: Deploy Frontend

The frontend has been built. Deploy the `.next` folder to your hosting:

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

**Option B: Firebase Hosting**
```bash
# Build is already done, deploy
firebase deploy --only hosting
```

**Option C: Manual Deployment**
- Upload the entire `.next` folder and other necessary files to your hosting
- Ensure `package.json`, `next.config.js`, and `.env.production` are included
- Run `npm install && npm run start` on the server

---

## Testing Guide

### Test Each Payment Gateway

#### 1. **Test PayU**

1. Go to a product page on your site
2. Select quantity and click "Buy Now"
3. Choose "PayU" from the payment options
4. You should be redirected to PayU's payment page
5. **Test Credentials:**
   - For Net Banking:
     - User: `payu`
     - Password: `payu`
     - OTP: `123456`
   - For Cards: Use PayU test cards from their documentation

**Expected Flow:**
```
Your Site → PayU Payment Page → Enter Details → Success/Failure → Your Confirmation Page
```

#### 2. **Test SabPaisa**

1. Go to a product page
2. Select quantity and click "Buy Now"
3. Choose "SabPaisa" from the payment options
4. You should be redirected to SabPaisa's payment page
5. **Test with real credentials** (SabPaisa doesn't have a test mode like PayU)

**Expected Flow:**
```
Your Site → SabPaisa Payment Page → Enter Details → Success/Failure → Your Confirmation Page
```

#### 3. **Test Airpay V4**

1. Go to a product page
2. Select quantity and click "Buy Now"
3. Choose "Airpay" from the payment options
4. You should be redirected to Airpay's payment page
5. **Test with real credentials** (Airpay V4 requires OAuth2, uses production credentials)

**Expected Flow:**
```
Your Site → OAuth2 Token Request → Airpay Payment Page → Enter Details → Success/Failure → Your Confirmation Page
```

---

## Debugging

### Check Backend Logs

On PythonAnywhere, check error logs:
```bash
# Go to Web tab → Log files → Error log
tail -f /var/log/mandi2mandi.error.log
```

Look for:
- `[PAYU]` - PayU logs
- `[SABPAISA]` - SabPaisa logs
- `[AIRPAY]` - Airpay logs
- `[PAYMENT ERROR]` - General payment errors

### Check Frontend Console

Open browser console (F12) and look for:
- `PAYU Response:` - PayU API response
- `SABPAISA Response:` - SabPaisa API response
- `AIRPAY Response:` - Airpay API response
- `Submitting ... payment form to:` - Payment submission logs

### Common Issues

**Issue 1: "No payment URL received"**
- Check backend logs for errors
- Verify all environment variables are set correctly
- Check if OAuth2 token is being generated (for Airpay)

**Issue 2: "Payment failed" on gateway page**
- Check if credentials are correct
- For PayU: Verify hash generation
- For SabPaisa: Check encryption keys
- For Airpay: Check OAuth2 credentials

**Issue 3: CORS errors**
- Backend should already handle OPTIONS requests
- Verify CORS configuration in `project/api/__init__.py`
- Check if `credentials: 'include'` is in frontend fetch calls

---

## API Endpoints Summary

### PayU Direct Buy
- **Endpoint:** `POST /api/initiate-payu-payment`
- **Request:**
  ```json
  {
    "product_id": 123,
    "product_name": "Product Name",
    "quantity": 10,
    "unit": "Kg",
    "price_per_unit": 500,
    "total_amount": 5000
  }
  ```
- **Response:**
  ```json
  {
    "payment_url": "https://secure.payu.in/_payment",
    "key": "MY7QQz",
    "txnid": "uuid...",
    "amount": "5000",
    "productinfo": "Product Name",
    "firstname": "User Name",
    "email": "user@example.com",
    "phone": "0000000000",
    "surl": "https://www.mandi.ramhotravels.com/api/payment-success",
    "furl": "https://www.mandi.ramhotravels.com/api/payment-failure",
    "hash": "generated_hash..."
  }
  ```

### SabPaisa Direct Buy
- **Endpoint:** `POST /api/initiate-sabpaisa-payment`
- **Request:** Same as PayU
- **Response:**
  ```json
  {
    "payment_url": "https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1",
    "encData": "encrypted_data...",
    "clientCode": "RKRM88"
  }
  ```

### Airpay V4 Direct Buy
- **Endpoint:** `POST /api/initiate-payment`
- **Request:** Same as PayU
- **Response:**
  ```json
  {
    "payment_url": "https://payments.airpay.co.in/pay/v4/index.php?token=...",
    "airpay_url": "https://payments.airpay.co.in/pay/v4/index.php?token=...",
    "privatekey": "generated_key...",
    "merchant_id": "351531",
    "encdata": "encrypted_data...",
    "checksum": "checksum...",
    "chmod": ""
  }
  ```

---

## Success Criteria

✅ All three payment gateways redirect to their payment pages without errors
✅ No CORS errors in browser console
✅ Payment form submissions work correctly
✅ Success/failure callbacks return to your site
✅ Orders are created in database with status "Pending"
✅ Button text remains visible on hover

---

## Contact & Support

If you encounter issues:

1. Check the logs (backend and frontend console)
2. Verify all environment variables
3. Test with provided test credentials (PayU)
4. Contact payment gateway support:
   - PayU: support@payu.in
   - SabPaisa: support@sabpaisa.in
   - Airpay: support@airpay.in

---

## Rollback Plan

If issues occur:

1. **Backend:** Revert to previous commit
   ```bash
   git revert HEAD
   git push
   ```

2. **Frontend:** Deploy previous build
   ```bash
   git checkout <previous-commit-hash>
   npm run build
   vercel --prod
   ```

---

Generated: 2026-01-02
