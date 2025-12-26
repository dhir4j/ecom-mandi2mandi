# Backend Subscription System Setup

This document explains the backend changes for the subscription payment system.

## Changes Made

### 1. Database Schema Updates

#### User Model (`project/api/models.py`)
Added the following fields to the `User` model:

```python
# Subscription fields
has_subscription = db.Column(db.Boolean, nullable=False, default=False)
subscription_expiry = db.Column(db.DateTime, nullable=True)
subscription_txn_id = db.Column(db.String(100), nullable=True)
subscription_payu_id = db.Column(db.String(100), nullable=True)
subscription_amount = db.Column(db.Float, nullable=True)
```

#### Updated `to_json()` method:
Now returns subscription status with user data:
```python
{
    'id': user.id,
    'name': user.name,
    'email': user.email,
    'role': user.role,
    'hasSubscription': user.has_subscription,
    'subscriptionExpiry': user.subscription_expiry.isoformat() if user.subscription_expiry else None
}
```

### 2. API Endpoints

#### Updated Signup Endpoint
- **Removed:** 'farmer' from allowed roles
- **Allowed roles:** 'trader', 'buyer', 'admin'

#### New Endpoint: Update Subscription
```
POST /api/auth/update-subscription
```

**Authentication:** Required (must be logged in)

**Request Body:**
```json
{
    "txnid": "TXN1234567890",
    "mihpayid": "PAYU123456",
    "amount": "199.00",
    "hasSubscription": true,
    "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
}
```

**Response (Success):**
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

**Response (Error):**
```json
{
    "error": "Missing required fields"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing fields)
- `401` - Unauthorized (not logged in)
- `500` - Server error

## Database Migration

### Step 1: Run Migration Script

```bash
cd /home/dhir4j/Documents/programs/mandi2mandi/project
python migrations/add_subscription_fields.py
```

This will:
- Check if subscription columns exist
- Add missing columns to the users table
- Show confirmation message

### Step 2: Verify Migration

Check the database to ensure new columns were added:

```bash
sqlite3 instance/site.db
```

```sql
PRAGMA table_info(users);
-- Should show the new subscription columns
```

## Deployment Steps

### 1. Backup Database
```bash
cp instance/site.db instance/site.db.backup
```

### 2. Run Migration
```bash
python migrations/add_subscription_fields.py
```

### 3. Restart Flask Application
```bash
# If using systemd
sudo systemctl restart mandi2mandi

# If running manually
# Stop the current process and restart
python run.py
```

### 4. Test the Endpoint

```bash
# Login first to get session cookie
curl -X POST https://www.mandi.ramhotravels.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# Test subscription update
curl -X POST https://www.mandi.ramhotravels.com/api/auth/update-subscription \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "txnid": "TEST123",
    "mihpayid": "PAYU123",
    "amount": "199.00",
    "hasSubscription": true,
    "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
  }'
```

## Integration with Payment Gateway

The endpoint is called from Next.js payment success callback:

**Frontend Flow:**
1. User completes PayU payment
2. PayU redirects to `/api/payment/success`
3. Success route verifies payment hash
4. If valid, calls backend: `POST /api/auth/update-subscription`
5. Backend updates user subscription
6. User redirected to success page with contact number

**Files Involved:**
- `src/app/api/payment/success/route.ts` (Next.js)
- `project/api/auth.py` (Flask backend)

## Security Considerations

1. **Authentication Required:**
   - Endpoint uses `@login_required` decorator
   - Only authenticated users can update their subscription

2. **Payment Verification:**
   - Hash verification happens in Next.js callback
   - Only verified payments trigger this endpoint

3. **Database Transactions:**
   - Changes are committed atomically
   - Rollback on error

4. **Input Validation:**
   - All required fields checked
   - Date format validated
   - Amount converted to float safely

## Subscription Logic

### Checking Active Subscription

In your frontend or other backend routes:

```python
def has_active_subscription(user):
    """Check if user has an active subscription"""
    from datetime import datetime

    if not user.has_subscription:
        return False

    if not user.subscription_expiry:
        return False

    return user.subscription_expiry > datetime.now()
```

### Monthly Renewal

For monthly subscriptions:
- Expiry is set to 30 days from payment date
- Users need to renew monthly
- Can add cron job to check and expire subscriptions

## Testing Checklist

- [ ] Migration script runs successfully
- [ ] Database columns added correctly
- [ ] Signup rejects 'farmer' role
- [ ] Signup accepts 'trader' and 'buyer' roles
- [ ] Login returns subscription status
- [ ] Update subscription endpoint works
- [ ] Contact number shows after subscription
- [ ] Payment integration flows correctly

## Troubleshooting

### Migration Fails
```bash
# Check database permissions
ls -l instance/site.db

# Check if database is locked
lsof instance/site.db

# Try manual SQL
sqlite3 instance/site.db < migrations/manual_migration.sql
```

### Endpoint Returns 401
- Check user is logged in
- Verify session cookies are sent
- Check Flask-Login configuration

### Date Parsing Error
- Ensure date is in ISO format
- Use `.isoformat()` when sending dates
- Handle timezone properly (UTC recommended)

## Support

For issues or questions:
- Check Flask logs: `tail -f logs/flask.log`
- Check database: `sqlite3 instance/site.db`
- Verify API with curl/Postman
- Contact: support@mandi2mandi.com
