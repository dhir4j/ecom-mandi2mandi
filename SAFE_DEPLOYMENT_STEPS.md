# SAFE DEPLOYMENT GUIDE - Cart System
## Your existing data will NOT be affected!

## What Changed:

### ✅ Database Changes (SAFE):
- **NEW:** `carts` table (new shopping cart storage)
- **NEW:** `cart_items` table (items in cart)
- **NO CHANGES** to existing tables: `users`, `products`, `orders`, `inquiries`, etc.

### ✅ Code Changes:
- **ADDED:** `/project/api/cart.py` (new cart API)
- **MODIFIED:** `/project/api/models.py` (added Cart and CartItem models)
- **MODIFIED:** `/project/api/payments.py` (added cart checkout)
- **MODIFIED:** `/project/api/__init__.py` (registered cart routes)

## Pre-Deployment Checklist

- [ ] I have read this guide completely
- [ ] I understand no existing data will be deleted
- [ ] I have access to PythonAnywhere console
- [ ] I have my database credentials

---

## STEP-BY-STEP DEPLOYMENT

### Option A: SAFEST (Recommended for Production)

#### Step 1: Backup Current Database (Optional but Recommended)

On PythonAnywhere bash console:
```bash
cd /home/YOUR_USERNAME/mandi2mandi/project

# Create backup (optional)
python3 migrations/backup_database.py
```

This creates a JSON backup file: `database_backup_YYYYMMDD_HHMMSS.json`

#### Step 2: Upload New Backend Files

Upload these files to PythonAnywhere (via Files tab or Git):
```
project/api/models.py
project/api/cart.py
project/api/payments.py
project/api/__init__.py
project/migrations/verify_and_migrate_cart.py
```

#### Step 3: Verify and Create Cart Tables

On PythonAnywhere bash console:
```bash
cd /home/YOUR_USERNAME/mandi2mandi/project

# This script is SAFE - it only adds new tables
python3 migrations/verify_and_migrate_cart.py
```

**What this script does:**
- ✓ Checks existing tables (doesn't modify them)
- ✓ Shows you what will be created
- ✓ Creates ONLY the new cart tables
- ✓ Verifies the tables were created
- ✓ Can be run multiple times safely

**Expected output:**
```
============================================================
CART TABLES MIGRATION VERIFICATION
============================================================

✓ Connected to database successfully
✓ Found 6 existing tables:
  - chat_messages
  - images
  - inquiries
  - orders
  - products
  - users

============================================================
CART TABLES STATUS
============================================================
○ 'carts' table NOT found - WILL CREATE
○ 'cart_items' table NOT found - WILL CREATE

============================================================
CREATING MISSING TABLES...
============================================================

✓ Migration completed successfully!

✓ Database now has 8 tables:
  - cart_items
  - carts
  - chat_messages
  - images
  - inquiries
  - orders
  - products
  - users

============================================================
VERIFICATION
============================================================
✓ 'carts' table verified
  Columns:
    - id (INTEGER)
    - user_id (INTEGER)
    - created_on (TIMESTAMP)
    - updated_on (TIMESTAMP)
✓ 'cart_items' table verified
  Columns:
    - id (INTEGER)
    - cart_id (INTEGER)
    - product_id (VARCHAR(100))
    - product_name (VARCHAR(200))
    - price_per_unit (FLOAT)
    - unit (VARCHAR(50))
    - quantity (FLOAT)
    - image_url (VARCHAR(500))
    - seller_name (VARCHAR(150))
    - location (VARCHAR(200))
    - created_on (TIMESTAMP)

============================================================
✓ MIGRATION SUCCESSFUL - ALL DATA PRESERVED
============================================================
```

#### Step 4: Reload Flask App

On PythonAnywhere Web tab:
- Click the **"Reload"** button for your web app

#### Step 5: Verify Backend is Working

Test the cart API:
```bash
# On PythonAnywhere bash console
curl https://YOUR_USERNAME.pythonanywhere.com/api/cart \
  -H "Cookie: session=YOUR_SESSION"
```

Expected response:
```json
{
  "success": true,
  "cart": {
    "id": 1,
    "items": [],
    "totalItems": 0,
    "totalAmount": 0
  }
}
```

---

### Option B: AUTOMATIC (Easiest)

If you trust the code (it's safe!), you can just:

1. **Upload the new backend files** to PythonAnywhere
2. **Reload your Flask app** on PythonAnywhere Web tab
3. **Done!** The `db.create_all()` in `api/__init__.py` will automatically create the new tables

This works because your code already has:
```python
with app.app_context():
    # ✅ FIXED: Only create tables if they don't exist
    # DO NOT drop tables - this preserves all your data including admin users!
    db.create_all()
```

---

## Frontend Deployment

### Step 1: Upload Frontend Files

Upload these files to your frontend hosting:
```
src/contexts/CartContext.tsx
src/components/product-card.tsx
src/components/header.tsx
src/app/layout.tsx
src/app/cart/page.tsx
src/app/cart/checkout/page.tsx
```

### Step 2: Build and Deploy

```bash
cd home/simple4j/mandi2mandi

# Install any new dependencies (none needed)
npm install

# Build
npm run build

# Deploy
# For Vercel: git push (auto-deploys)
# For Firebase: firebase deploy
```

---

## Verification Checklist

After deployment, verify these work:

### Backend Verification:
- [ ] Flask app loads without errors
- [ ] `/api/cart` endpoint responds
- [ ] Existing endpoints still work (`/api/my-orders`, etc.)
- [ ] Database has 8 tables (6 old + 2 new)

### Frontend Verification:
- [ ] Products page loads
- [ ] Can add items to cart (shows "Add to Cart" button)
- [ ] Cart icon appears in header
- [ ] Cart page shows items
- [ ] Checkout works
- [ ] Payment flow completes

---

## Rollback Plan (Just in Case)

If something goes wrong (unlikely):

### Backend Rollback:
1. Re-upload the OLD versions of these files:
   - `api/models.py`
   - `api/payments.py`
   - `api/__init__.py`
2. Delete `api/cart.py`
3. Reload Flask app

**Note:** The new cart tables will remain in the database (harmless) but won't be used.

### Frontend Rollback:
1. Redeploy previous version from Git
2. Or revert the Git commit and redeploy

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'flask_sqlalchemy'"
**Solution:** You're running the migration script locally. Run it on PythonAnywhere where Flask is installed.

### Issue: Migration script shows errors
**Solution:**
1. Check database connection in `config.py`
2. Verify PostgreSQL is running
3. Share the error message for help

### Issue: Cart API returns 404
**Solution:**
1. Verify `cart.py` was uploaded
2. Check `__init__.py` has `app.register_blueprint(cart_bp)`
3. Reload Flask app

### Issue: Frontend can't connect to cart API
**Solution:**
1. Check `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`
2. Verify CORS settings in backend `__init__.py`
3. Check browser console for errors

---

## Summary

### What's Safe:
✅ Your existing tables are NOT modified
✅ Your existing data is NOT deleted
✅ Old APIs continue to work
✅ Migration can be run multiple times
✅ You can rollback if needed

### What's New:
🆕 2 new database tables (`carts`, `cart_items`)
🆕 Cart API endpoints
🆕 Cart checkout flow
🆕 "Add to Cart" on product cards
🆕 Cart icon in header

---

## Questions?

If you see any errors during deployment:
1. Don't panic - your data is safe
2. Note the exact error message
3. Check which step failed
4. Your existing website will keep working

The new cart tables are ONLY used by the new cart features. All your existing functionality (orders, inquiries, products) continues to work exactly as before.

---

**Ready to deploy?** Start with Option A (Step 1) for the safest approach!
