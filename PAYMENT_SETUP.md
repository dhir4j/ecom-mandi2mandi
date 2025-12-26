# Payment Integration Setup Guide

## PayU Integration for Subscription Feature

This application uses PayU payment gateway for processing subscription payments (₹199/month).

### Prerequisites

1. PayU Merchant Account
   - Sign up at: https://www.payu.in/merchant-account
   - Get access to merchant dashboard

2. Required Credentials
   - Merchant Key
   - Merchant Salt
   - Access to both Test and Live environments

### Environment Variables Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your PayU credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_PAYU_KEY=your_merchant_key
   PAYU_MERCHANT_KEY=your_merchant_key
   PAYU_SALT=your_salt_key
   PAYU_URL=https://test.payu.in/_payment  # Use https://secure.payu.in/_payment for production
   ```

### Backend API Requirements

The subscription feature requires the following backend API endpoint:

#### Update Subscription Endpoint

**URL:** `https://www.mandi.ramhotravels.com/api/auth/update-subscription`

**Method:** `POST`

**Headers:**
- `Content-Type: application/json`
- Include cookies for authentication

**Request Body:**
```json
{
  "txnid": "transaction_id_from_payu",
  "mihpayid": "payu_payment_id",
  "amount": "199.00",
  "hasSubscription": true,
  "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "name": "User Name",
    "email": "user@example.com",
    "role": "buyer",
    "hasSubscription": true,
    "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
  }
}
```

### Payment Flow

1. **User clicks "Contact Seller"** → System checks subscription status
2. **No subscription** → Show paywall modal (₹199/month)
3. **User clicks "Subscribe Now"** → Request sent to `/api/payment/initiate`
4. **Hash generated** → User redirected to PayU payment page
5. **Payment completed** → PayU redirects to success/failure callback
6. **Success callback** → Updates user subscription in database
7. **Contact number revealed** → Shows 8827095122 for all products

### Testing

#### Test Mode
- Use PayU test credentials
- Test cards: https://devguide.payu.in/test-cards/

#### Common Test Cards
- Success: 5123456789012346, CVV: 123, Expiry: Any future date
- Failure: 5123456789012384, CVV: 123, Expiry: Any future date

### Security Considerations

1. **Hash Verification**
   - Always verify PayU response hash on backend
   - Never trust payment status from frontend alone

2. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use different keys for test and production

3. **HTTPS Only**
   - PayU callbacks require HTTPS in production
   - Test with ngrok/cloudflare tunnel in development

### Features

- ✅ One-time monthly subscription (₹199)
- ✅ Secure PayU payment gateway
- ✅ Automatic subscription tracking
- ✅ Contact number reveal after payment
- ✅ Success/failure pages
- ✅ Hash verification for security

### Contact Number

After successful subscription, users get access to:
**Seller Contact:** 8827095122 (for all products)

### Support

For payment integration issues:
- PayU Support: https://payu.in/support
- Documentation: https://devguide.payu.in/

For app-specific issues:
- Email: support@mandi2mandi.com
