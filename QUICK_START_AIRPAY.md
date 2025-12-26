# Airpay Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Credentials
Open `.credentials/AIRPAY_CREDENTIALS.txt` to get your credentials.

> ⚠️ **Important**: The `.credentials/` folder is gitignored and contains sensitive payment gateway credentials.

### Step 2: Environment Variables
Copy credentials from `.credentials/AIRPAY_CREDENTIALS.txt` to your `.env` file:
```env
# Get actual values from .credentials/AIRPAY_CREDENTIALS.txt
AIRPAY_MERCHANT_ID=<from_credentials_file>
AIRPAY_USERNAME=<from_credentials_file>
AIRPAY_PASSWORD=<from_credentials_file>
AIRPAY_SECRET_KEY=<from_credentials_file>
AIRPAY_BASE_URL=https://payments.airpay.co.in/pay/index.php
```

### Step 3: Configure Airpay Dashboard
Log into your Airpay merchant dashboard and add these callback URLs:

**Success URL:**
```
https://www.mandi.ramhotravels.com/api/airpay-payment-success
```

**Failure URL:**
```
https://www.mandi.ramhotravels.com/api/airpay-payment-failure
```

### Step 4: Restart Backend
```bash
cd project
python run.py
```

### Step 5: Test
1. Go to checkout page
2. Select "Airpay" gateway
3. Complete a test payment
4. Verify order status updates

---

## 📁 Files Added/Modified

### New Files
- ✅ `project/api/airpay_utils.py` - Airpay utilities
- ✅ `AIRPAY_SETUP.md` - Full documentation
- ✅ `AIRPAY_INTEGRATION_SUMMARY.md` - Integration summary

### Modified Files
- ✅ `.env.example` - Added Airpay credentials
- ✅ `project/config.py` - Added Airpay config
- ✅ `project/api/payments.py` - Added Airpay endpoints
- ✅ `src/components/checkout-client-page.tsx` - Added 3rd gateway option

---

## 🔑 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/initiate-payment` | POST | Initiate Airpay payment (set `gateway: "airpay"`) |
| `/api/airpay-payment-success` | POST | Handle successful payment callback |
| `/api/airpay-payment-failure` | POST | Handle failed payment callback |

---

## 🎯 How Users Pay with Airpay

1. User selects product and proceeds to checkout
2. User selects **Airpay** from 3 gateway options (PayU, SabPaisa, Airpay)
3. User clicks "Pay Securely"
4. User is redirected to Airpay payment page
5. User completes payment
6. Airpay redirects back to success/failure callback
7. Order status is updated
8. User sees confirmation page

---

## 🔒 Security Features

- ✅ SHA256 encryption for credentials
- ✅ SHA256 checksum for payment data
- ✅ CRC32 checksum verification for callbacks
- ✅ HTTPS-only communication
- ✅ Dynamic privatekey generation

---

## 🐛 Common Issues & Quick Fixes

### Issue: Checksum validation failed
**Fix**: Verify merchant ID and username in config match Airpay dashboard

### Issue: Callback not received
**Fix**: Ensure callback URLs are configured in Airpay dashboard and accessible publicly (not localhost)

### Issue: Payment redirects but fails
**Fix**: Check that all buyer details (email, phone, address) are valid and properly formatted

---

## 📞 Support

**Airpay:**
- Operations: operations@airpay.co.in
- Technical: tech@airpay.co.in

**Documentation:**
- Full Setup: `AIRPAY_SETUP.md`
- Integration Summary: `AIRPAY_INTEGRATION_SUMMARY.md`

---

## ✅ Testing Checklist

- [ ] Airpay gateway appears on checkout page
- [ ] Can select Airpay and submit payment
- [ ] Redirects to Airpay payment page
- [ ] Successful payment updates order to "Booked"
- [ ] Failed payment updates order to "Failed"
- [ ] Confirmation page shows correct status

---

## 🎉 You're Ready!

The Airpay integration is complete and ready to use. All three payment gateways (PayU, SabPaisa, Airpay) are now available to users at checkout.

For detailed information, see `AIRPAY_SETUP.md`
