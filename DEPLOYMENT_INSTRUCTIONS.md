# Airpay V4 Deployment Instructions

## Summary of Changes

All changes have been committed and pushed to GitHub. You now need to deploy these changes to your servers.

## 🔄 Backend Deployment (PythonAnywhere)

### 1. Pull Latest Changes

SSH into PythonAnywhere or open a Bash console, then run:

```bash
cd /home/dhir4j/Documents/programs/mandi2mandi

# Pull latest changes
git pull origin master

# Install any new dependencies
pip3 install --user -r project/requirements.txt

# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete
```

### 2. Set Environment Variables

In PythonAnywhere Web tab → "Environment variables" section:

**Add these new variables:**

| Variable Name | Value | Where to Get |
|--------------|-------|--------------|
| `AIRPAY_CLIENT_ID` | Your OAuth2 Client ID | Contact Airpay support |
| `AIRPAY_CLIENT_SECRET` | Your OAuth2 Client Secret | Contact Airpay support |

**Verify these existing variables are set:**

| Variable Name | Should be Set |
|--------------|---------------|
| `AIRPAY_MERCHANT_ID` | ✓ |
| `AIRPAY_USERNAME` | ✓ |
| `AIRPAY_PASSWORD` | ✓ |
| `AIRPAY_SECRET_KEY` | ✓ |

### 3. Reload Web App

- Go to PythonAnywhere **Web** tab
- Click the green **"Reload"** button
- Wait for "Reloaded successfully" message

## 🎨 Frontend Deployment (Vercel/Next.js)

### 1. Pull Latest Changes

```bash
cd /home/dhir4j/Documents/programs/mandi2mandi

# Pull latest changes
git pull origin master

# Install dependencies (if needed)
npm install
```

### 2. Build and Deploy

If you're using Vercel (auto-deploy):
- Changes should deploy automatically from GitHub

If deploying manually:
```bash
# Build the Next.js app
npm run build

# Deploy to your hosting
npm run deploy
# OR
vercel --prod
```

## ✅ Testing the Implementation

### Test Steps:

1. **Navigate to Subscription Page**
   - Open your website
   - Click to subscribe

2. **Select Airpay Gateway**
   - Choose "Airpay" from payment options
   - A phone number input field should appear

3. **Enter Phone Number**
   - Enter a valid 10-digit mobile number
   - Format: 9876543210

4. **Complete Payment**
   - Click "Subscribe Now"
   - You should be redirected to Airpay payment page
   - Complete the test transaction

### Expected Behavior:

✅ Phone input appears when Airpay is selected
✅ Phone input validates 10 digits
✅ Cannot submit without valid phone number
✅ Payment redirects to Airpay V4 page
✅ No "Invalid Mobile Number" error
✅ Successful payment redirects back to your site

## 🐛 Troubleshooting

### Issue: "Missing required Airpay URL"
**Solution:** Backend not updated. Pull latest code and reload web app.

### Issue: "Invalid Mobile Number"
**Solution:**
- Frontend not updated. Redeploy Next.js app
- Or phone validation not working. Check browser console for errors

### Issue: "Failed to get OAuth2 access token"
**Solution:**
- `AIRPAY_CLIENT_ID` or `AIRPAY_CLIENT_SECRET` not set
- Contact Airpay to get valid OAuth2 credentials
- Verify credentials in PythonAnywhere environment variables

### Issue: Phone input doesn't appear
**Solution:**
- Clear browser cache
- Ensure frontend is deployed with latest code
- Check browser console for React errors

## 📝 Files Changed

### Backend (Python/Flask):
- `project/api/airpay_utils.py` - Complete V4 API implementation
- `project/api/payments.py` - Updated endpoints for V4
- `project/config.py` - Added OAuth2 credentials
- `project/requirements.txt` - Added requests library

### Frontend (Next.js/React):
- `src/components/subscription-paywall.tsx` - Added phone input for Airpay

### Documentation:
- `AIRPAY_V4_CONFIGURATION.md` - Complete setup guide
- `DEPLOYMENT_INSTRUCTIONS.md` - This file

## 🔐 Security Notes

1. **Never commit credentials** to Git
2. OAuth2 credentials are sensitive - store in environment variables only
3. Rotate credentials periodically
4. Monitor callback endpoints for suspicious activity

## 📞 Support

If issues persist:

1. Check error logs:
   - PythonAnywhere: Web tab → Error log
   - Next.js: Browser console → Network tab

2. Verify environment variables are set correctly

3. Ensure OAuth2 credentials from Airpay are valid

4. Contact Airpay support for API-specific issues

## 🎉 What's New in V4

- ✨ OAuth2 authentication for enhanced security
- 🔒 AES-CBC encryption for all requests/responses
- 📱 Phone number collection for better user verification
- 🚀 Improved error handling and logging
- ✅ Support for both regular and subscription payments

---

**Last Updated:** 2024-12-30
**Version:** 4.0.0
