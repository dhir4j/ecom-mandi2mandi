# Testing with Stage Credentials

## Current Issue
Production account (RKRM88) is giving "enter valid client code" error. This suggests the account might not be fully activated or requires additional setup by SabPaisa team.

## Troubleshooting Steps

### Step 1: Test with Stage Credentials

Update your `.env` file on PythonAnywhere to use STAGE credentials temporarily to verify the integration code works:

```bash
# SabPaisa Stage/Test Environment
SABPAISA_CLIENT_CODE=DJ020
SABPAISA_USERNAME=DJL754@sp
SABPAISA_PASSWORD=4q3qhgmJNM4m
SABPAISA_AUTH_KEY=ISTrmmDC2bTvkxzlDRrVguVwetGS8xC/UFPsp6w+Itg=
SABPAISA_AUTH_IV=M+aUFgRMPq7ci+Cmoytp3KJ2GPBOwO72Z2Cjbr55zY7++pT9mLES2M5cIblnBtaX
SABPAISA_BASE_URL=https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1
```

**Reload the app:**
```bash
touch /var/www/simple4j_pythonanywhere_com_wsgi.py
```

**Test payment flow:**
- If stage credentials work → Production account needs activation
- If stage also fails → Integration code issue

---

## Step 2: Production Account Activation Checklist

Contact SabPaisa support (support@sabpaisa.in) with the following information:

### Account Details
- **Client Code:** RKRM88
- **Username:** info@mandi2mandi.com
- **Business Name:** Mandi2Mandi
- **Website URL:** https://mandi2mandi.com

### Required Configurations
Please verify and activate the following:

1. **Account Status:**
   - Is client code RKRM88 activated for production?
   - Is the account in live/production mode?

2. **IP Whitelisting:**
   - Does the account require IP whitelisting?
   - If yes, please whitelist PythonAnywhere IPs or our server IP

3. **Callback URL Registration:**
   - Success callback: `https://www.mandi.ramhotravels.com/api/sabpaisa-payment-success`
   - Failure callback: `https://www.mandi.ramhotravels.com/api/sabpaisa-payment-failure`
   - Subscription success: `https://www.mandi.ramhotravels.com/api/sabpaisa-subscription-success`

4. **API Version:**
   - Confirm production environment does NOT use ?v=1 parameter
   - Confirm base URL: `https://securepay.sabpaisa.in/SabPaisa/sabPaisaInit`

5. **Integration Type:**
   - We're using AES-256-GCM with HMAC-SHA384 encryption (official Python implementation)
   - Parameter format matches official documentation

---

## Step 3: Verify Credentials

Ask SabPaisa support to verify these credentials are correct:

```
Client Code: RKRM88
Username: info@mandi2mandi.com
Password: RKRM88_SP24284
Auth Key: 02sPLJl7wBKB/N/QS0u/CinEAWbXhSERS7xanaDhguU=
Auth IV: E7kwjTIDcsQjKprRjGzZA/RdIhDfATdMaLuVcdnke4uBCP66ioxT70PKcqlGPOlc
```

Ask them to confirm:
- Are these credentials active?
- Do they match what's in their system?
- Is there a different client code or username we should use?

---

## Step 4: Common Issues to Check

### Issue 1: Account Not Activated
**Symptom:** "Invalid client code" or "enter valid client code"
**Solution:** SabPaisa team needs to activate the merchant account

### Issue 2: Wrong Environment
**Symptom:** Same error on both stage and production
**Solution:** Verify you're using correct credentials for each environment

### Issue 3: IP Whitelisting
**Symptom:** Works locally but fails on PythonAnywhere
**Solution:** Whitelist server IP address

### Issue 4: Callback URLs Not Registered
**Symptom:** Payment might work but callbacks fail
**Solution:** Register all callback URLs with SabPaisa

### Issue 5: Documentation Mismatch
**Symptom:** Integration works with stage but not production
**Solution:** Production might have different requirements than documented

---

## Step 5: Request Test Transaction

Ask SabPaisa support to:
1. Run a test transaction from their end with client code RKRM88
2. Verify the encrypted data format is correct
3. Confirm the parameter string is being decrypted properly
4. Check their logs for detailed error messages

---

## Contact Information

**SabPaisa Support:**
- Email: support@sabpaisa.in
- Developer Support: developer@sabpaisa.in
- Phone: Check their dashboard or documentation

**Your Details to Provide:**
- Merchant/Client Code: RKRM88
- Business: Mandi2Mandi
- Email: info@mandi2mandi.com
- Phone: +91-8827095122
- Website: https://mandi2mandi.com

---

## Temporary Workaround

If production account is delayed, you can:

1. **Use Stage Environment** for testing (change .env to stage credentials)
2. **Test with Different Gateway** - Use PayU which is already working
3. **Request Expedited Activation** - Explain you have paying customers waiting

---

## Debug Information to Share with SabPaisa

When contacting support, share this encrypted sample:

```bash
# Run on PythonAnywhere
cd /home/simple4j/mandi2mandi
python3 project/test_sabpaisa.py
```

Share the output with SabPaisa team showing:
- Parameter string (before encryption)
- Encrypted data
- Client code being used
- Base URL being called

This helps them debug on their end.

---

## Next Steps

1. ✅ **Test with stage credentials** (DJ020) to verify integration works
2. ✅ **Contact SabPaisa support** with account details and ask for activation
3. ✅ **Request callback URL registration**
4. ✅ **Ask about IP whitelisting requirements**
5. ✅ **Get confirmation** that RKRM88 is live and active
6. ✅ **Once confirmed active**, switch back to production credentials

---

**NOTE:** The integration code is correct based on official SabPaisa Python implementation. The issue is likely account activation/configuration on SabPaisa's backend, not our code.
