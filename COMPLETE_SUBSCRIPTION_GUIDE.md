# Complete Subscription System Guide

## Overview

This is the complete guide for the Mandi2Mandi subscription system that allows users to pay ₹199/month to unlock seller contact details.

---

## 📋 System Architecture

```
User Action → PayU Payment → Payment Callback → Backend Update → Contact Reveal

Frontend (Next.js)          Backend (Flask)
├── Paywall Modal          ├── User Model (with subscription)
├── Payment Initiate       ├── Update Subscription Endpoint
├── Success/Failure Pages  └── Contact Number Storage
└── Product Details Page
```

---

## 🔧 Setup Instructions

### Backend Setup (Flask)

#### 1. Run Database Migration

```bash
cd /home/dhir4j/Documents/programs/mandi2mandi/project
python migrations/add_subscription_fields.py
```

**What this does:**
- Adds 5 new columns to users table:
  - `has_subscription` (BOOLEAN)
  - `subscription_expiry` (DATETIME)
  - `subscription_txn_id` (VARCHAR)
  - `subscription_payu_id` (VARCHAR)
  - `subscription_amount` (FLOAT)

#### 2. Restart Flask Server

```bash
# If using systemd
sudo systemctl restart mandi2mandi

# Or manually
python run.py
```

#### 3. Test Backend Endpoint

```bash
python test_subscription_endpoint.py
```

### Frontend Setup (Next.js)

#### 1. Configure PayU Credentials

Create `.env.local` in the Next.js root:

```env
NEXT_PUBLIC_PAYU_KEY=your_merchant_key
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_SALT=your_salt_key
PAYU_URL=https://test.payu.in/_payment
```

#### 2. Install Dependencies (if needed)

All required components are already created. No additional npm packages needed.

#### 3. Build and Deploy

```bash
npm run build
npm start
```

---

## 🎯 Complete User Flow

### For Buyers Without Subscription

1. **Browse Products** → User finds a product
2. **Click Product** → Opens product details page
3. **Click "Contact Seller"** → Sees paywall modal
4. **Click "Subscribe Now" (₹199/month)** → Redirects to PayU
5. **Complete Payment** → PayU processes payment
6. **Payment Success** → Redirected to success page
7. **Backend Updated** → User subscription status updated
8. **Contact Revealed** → Shows phone number: **8827095122**
9. **Future Access** → All products show contact number

### For Buyers With Active Subscription

1. **Click "Contact Seller"** → Contact number immediately visible
2. **No paywall shown** → Direct access to **8827095122**

### Send Inquiry (All Users)

1. **Click "Send Inquiry"** → Opens WhatsApp-style chat
2. **Type Message** → Real-time chat interface
3. **Click Send** → Shows "successfully sent" (frontend only)
4. **Message Logged** → (Backend integration pending)

---

## 📁 File Structure

### Backend Files

```
project/
├── api/
│   ├── auth.py                          # ✅ Updated with subscription endpoint
│   └── models.py                        # ✅ Updated User model
├── migrations/
│   └── add_subscription_fields.py       # ✅ Database migration script
├── test_subscription_endpoint.py        # ✅ Test script
└── SUBSCRIPTION_BACKEND_SETUP.md        # ✅ Backend documentation
```

### Frontend Files

```
src/
├── app/
│   ├── api/payment/
│   │   ├── initiate/route.ts           # ✅ PayU hash generation
│   │   ├── success/route.ts            # ✅ Payment success handler
│   │   └── failure/route.ts            # ✅ Payment failure handler
│   ├── payment/
│   │   ├── success/page.tsx            # ✅ Success page with contact
│   │   └── failed/page.tsx             # ✅ Failure page
│   └── order/[id]/page.tsx             # ✅ Updated to use new component
├── components/
│   ├── product-details-page.tsx        # ✅ Main product page
│   ├── subscription-paywall.tsx        # ✅ Paywall modal (₹199)
│   └── inquiry-chat-modal.tsx          # ✅ Chat interface
├── hooks/
│   └── use-auth.tsx                    # ✅ Updated with subscription
└── .env.example                         # ✅ PayU config template
```

---

## 🔑 API Reference

### Backend Endpoint

**POST** `/api/auth/update-subscription`

**Headers:**
- `Content-Type: application/json`
- `Cookie: session=...` (from login)

**Request:**
```json
{
  "txnid": "TXN1701234567890",
  "mihpayid": "PAYU123456789",
  "amount": "199.00",
  "hasSubscription": true,
  "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "hasSubscription": true,
    "subscriptionExpiry": "2024-12-31T23:59:59+00:00"
  }
}
```

---

## 💳 Payment Integration

### PayU Configuration

**Test Mode:**
```env
PAYU_URL=https://test.payu.in/_payment
```

**Production Mode:**
```env
PAYU_URL=https://secure.payu.in/_payment
```

### Test Cards

| Card Number         | CVV | Expiry | Result  |
|---------------------|-----|--------|---------|
| 5123456789012346    | 123 | 12/25  | Success |
| 5123456789012384    | 123 | 12/25  | Failure |

### Hash Generation

Automatically handled by `/api/payment/initiate`:
```
SHA512(key|txnid|amount|productinfo|firstname|email|||||||||||SALT)
```

---

## 🎨 UI Components

### 1. Subscription Paywall Modal

**Features:**
- Premium pricing display (₹199/month)
- Feature list with checkmarks
- "Subscribe Now" button
- "Maybe Later" option
- PayU trust badge

### 2. Chat Inquiry Modal

**Features:**
- Seller name with avatar
- WhatsApp-style bubbles
- Message timestamps
- Delivery status (✓ / ✓✓)
- Auto-scroll to latest message

### 3. Contact Number Display

**Before Subscription:**
- Lock icon on button
- "Unlock Contact" text
- Subscription prompt

**After Subscription:**
- Green success card
- Large clickable phone number: **8827095122**
- "Tap to call" instruction

---

## 🔒 Security Features

1. **Backend:**
   - `@login_required` decorator on update endpoint
   - Hash verification for PayU responses
   - Database transaction rollback on errors
   - Input validation and sanitization

2. **Frontend:**
   - Server-side hash generation (not exposed to client)
   - HTTPS enforced in production
   - CORS properly configured
   - No sensitive data in client state

3. **Payment:**
   - PayU PCI DSS compliant
   - Hash verification prevents tampering
   - Amount verification on callback

---

## 📊 Database Schema

### Users Table (Updated)

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer',
    registered_on DATETIME NOT NULL,

    -- New subscription fields
    has_subscription BOOLEAN NOT NULL DEFAULT 0,
    subscription_expiry DATETIME NULL,
    subscription_txn_id VARCHAR(100) NULL,
    subscription_payu_id VARCHAR(100) NULL,
    subscription_amount FLOAT NULL
);
```

---

## 🧪 Testing

### Manual Testing

1. **Test Signup (No Farmer Role):**
   ```bash
   curl -X POST https://www.mandi.ramhotravels.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@test.com","password":"pass123","role":"buyer"}'
   ```

2. **Test Login:**
   ```bash
   curl -X POST https://www.mandi.ramhotravels.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"pass123"}' \
     -c cookies.txt
   ```

3. **Test Subscription Update:**
   ```bash
   curl -X POST https://www.mandi.ramhotravels.com/api/auth/update-subscription \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d @subscription_data.json
   ```

### Automated Testing

```bash
python test_subscription_endpoint.py
```

---

## 🚀 Deployment Checklist

- [ ] Backend migration completed
- [ ] Database backup created
- [ ] PayU credentials configured
- [ ] HTTPS enabled
- [ ] Flask server restarted
- [ ] Next.js rebuilt and deployed
- [ ] Endpoint tested with curl
- [ ] Test payment completed
- [ ] Contact number reveals correctly
- [ ] Chat modal works
- [ ] Error handling tested

---

## 📞 Contact Information

**Seller Contact Number (After Subscription):**
```
8827095122
```

**Support:**
- Email: support@mandi2mandi.com
- For payment issues: PayU Support

---

## 🔄 Subscription Renewal

**Current Setup:**
- One-time monthly payment: ₹199
- Valid for 30 days from payment date
- No auto-renewal (manual payment required)

**Future Enhancement:**
- Add auto-renewal option
- Add email reminders before expiry
- Add subscription management page

---

## ⚠️ Known Limitations

1. **Chat Messages:** Currently frontend-only, not stored in database
2. **Auto-Renewal:** Not implemented (manual renewal required)
3. **Expiry Checking:** Needs cron job for automatic expiry
4. **Payment History:** Not tracked (only latest subscription)

---

## 📝 License & Credits

- PayU Integration: https://payu.in
- Next.js Framework: https://nextjs.org
- Flask Backend: https://flask.palletsprojects.com
