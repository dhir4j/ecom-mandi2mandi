# Airpay Gateway Configuration URLs

## URLs to Configure at Airpay Gateway Portal

Please configure these URLs in your Airpay merchant portal at: https://sanctum.airpay.co.in

---

## 1. Domain URL (Initiation URL)
**Complete web address used to initiate payment requests:**

```
https://www.mandi.ramhotravels.com
```

**Purpose:** This is the BACKEND domain where payment API is hosted and from which payment requests will be initiated.

**Note:**
- Backend (API): `https://www.mandi.ramhotravels.com` ← Register this in Airpay portal
- Frontend (User-facing): `https://mandi2mandi.com` ← Do NOT use this for mer_dom

---

## 2. Response URL (Callback URL)
**URL where Airpay will redirect users after payment processing:**

### Success Response URL:
```
https://www.mandi.ramhotravels.com/api/airpay-payment-success
```

### Failure Response URL:
```
https://www.mandi.ramhotravels.com/api/airpay-payment-failure
```

**Purpose:** After the user completes payment (success or failure), Airpay will redirect to these URLs with encrypted payment response data.

**Method:** POST (form submission)

**Parameters Expected:**
- `response` - Encrypted response data from Airpay
- Other parameters as per Airpay V4 specification

---

## 3. IPN URL (Server-to-Server Callback)
**Instant Payment Notification - For pending transactions and network failures:**

```
https://www.mandi.ramhotravels.com/api/airpay-ipn
```

**Purpose:** This URL will receive Server-to-Server (S2S) notifications from Airpay for:
- Pending transactions that couldn't complete in real-time
- Network failures during payment
- Delayed payment confirmations
- Transaction status updates

**Method:** POST

**Expected Parameters:** Same as response URL (encrypted data)

---

## 4. Subscription Payment URLs (If using subscriptions)

### Subscription Success URL:
```
https://www.mandi.ramhotravels.com/api/airpay-subscription-success
```

### Subscription Failure URL:
```
https://www.mandi.ramhotravels.com/api/airpay-subscription-failure
```

---

## Summary Table

| Configuration Type | URL | Method | Purpose |
|-------------------|-----|--------|---------|
| **Domain URL** | `https://mandi2mandi.com` | - | Payment initiation domain |
| **Success Response URL** | `https://www.mandi.ramhotravels.com/api/airpay-payment-success` | POST | User redirect after successful payment |
| **Failure Response URL** | `https://www.mandi.ramhotravels.com/api/airpay-payment-failure` | POST | User redirect after failed payment |
| **IPN URL** | `https://www.mandi.ramhotravels.com/api/airpay-ipn` | POST | S2S notification for pending/failed transactions |
| **Subscription Success** | `https://www.mandi.ramhotravels.com/api/airpay-subscription-success` | POST | Subscription payment success |
| **Subscription Failure** | `https://www.mandi.ramhotravels.com/api/airpay-subscription-failure` | POST | Subscription payment failure |

---

## Additional Information for Gateway Configuration

### IP Whitelisting (if required):
Please whitelist the following IPs for your backend server:
- Check your PythonAnywhere server IP: `curl ifconfig.me`
- Or ask PythonAnywhere support for the IP range

### Security:
- All URLs use HTTPS (SSL/TLS encrypted)
- Response data is encrypted using AES-256-CBC
- Checksum validation using SHA-256
- OAuth2 authentication for payment initiation

### Response Format:
All callback URLs expect encrypted response in this format:
```
POST /api/airpay-payment-success
Content-Type: application/x-www-form-urlencoded

response=<encrypted_data>
```

---

## IPN Implementation Status

⚠️ **IMPORTANT:** The IPN endpoint needs to be implemented on your backend.

### Current Status:
- ✅ Success/Failure URLs implemented
- ❌ IPN URL **NOT YET IMPLEMENTED**

### Action Required:
Add the IPN endpoint to handle S2S notifications for pending transactions.

---

## Backend Implementation Required

You need to add this endpoint to your backend (`project/api/payments.py`):

```python
@payments_bp.route('/airpay-ipn', methods=['POST', 'OPTIONS'])
def airpay_ipn():
    """
    Handle Airpay IPN (Instant Payment Notification) - Server to Server
    This receives notifications for pending/failed transactions
    """
    # Handle OPTIONS preflight
    from flask import make_response
    if request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    try:
        # Get encrypted response from Airpay
        airpay_data = request.form.to_dict()

        print(f"[AIRPAY IPN] Received S2S notification: {list(airpay_data.keys())}")

        # Validate and decrypt the response
        validation_result = validate_airpay_response(
            airpay_data,
            current_app.config['AIRPAY_MERCHANT_ID'],
            current_app.config['AIRPAY_USERNAME'],
            current_app.config['AIRPAY_PASSWORD']
        )

        if not validation_result['valid']:
            error_msg = validation_result.get('error', 'Invalid response')
            print(f"[AIRPAY IPN ERROR] Validation failed: {error_msg}")
            return jsonify({'status': 'error', 'message': error_msg}), 400

        # Extract transaction details
        transaction_status = validation_result['status']
        txnid = validation_result['transaction_id']
        ap_txn_id = validation_result['ap_transaction_id']
        amount = validation_result['amount']

        print(f"[AIRPAY IPN] TxnID: {txnid}, Status: {transaction_status}, Amount: {amount}")

        # Update order status based on transaction status
        order = Order.query.filter_by(utr_code=txnid).first()

        if order:
            if transaction_status == '200':  # Success
                order.status = 'Booked'
                order.utr_code = ap_txn_id  # Update with Airpay transaction ID
                print(f"[AIRPAY IPN] Order {order.id} marked as Booked")
            else:  # Failed or other status
                order.status = 'Failed'
                print(f"[AIRPAY IPN] Order {order.id} marked as Failed")

            db.session.commit()
        else:
            print(f"[AIRPAY IPN WARNING] Order not found for txnid: {txnid}")

        # Return success response to Airpay
        return jsonify({
            'status': 'success',
            'message': 'IPN processed successfully',
            'txnid': txnid
        }), 200

    except Exception as e:
        print(f"[AIRPAY IPN ERROR] Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

---

## Testing IPN

### Manual Testing:
You can test the IPN endpoint using curl:

```bash
curl -X POST https://www.mandi.ramhotravels.com/api/airpay-ipn \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "response=<encrypted_test_data>"
```

### Production Testing:
1. Make a test payment with Airpay
2. Simulate network failure (close browser immediately after payment)
3. Airpay will send IPN notification to your IPN URL
4. Check backend logs for IPN processing

---

## Support Contact

If you face any issues during configuration:

**Airpay Support:**
- Email: support@airpay.in
- Portal: https://sanctum.airpay.co.in
- Phone: Check Airpay merchant portal

**Integration Developer:**
- Check logs at: PythonAnywhere → Web → Log files
- Test endpoints at: https://www.mandi.ramhotravels.com/api/

---

## Checklist for Gateway Configuration

- [ ] Configure Domain URL at Airpay portal
- [ ] Configure Success Response URL
- [ ] Configure Failure Response URL
- [ ] Configure IPN URL
- [ ] Test with test transaction
- [ ] Verify IPN notifications are received
- [ ] Check order status updates correctly
- [ ] Whitelist IPs (if required by Airpay)
- [ ] Verify SSL certificate is valid

---

**Configuration Date:** 2026-01-02

**Important:** After configuring these URLs at Airpay portal, please:
1. Implement the IPN endpoint (code provided above)
2. Deploy to PythonAnywhere
3. Test with a small transaction
4. Verify IPN notifications in backend logs
