# Quick Deploy Guide - 5 Minutes

## Step 1: Backend (2 minutes)

### Upload these files to PythonAnywhere:
```
project/api/models.py
project/api/cart.py
project/api/payments.py
project/api/__init__.py
```

### Run migration:
```bash
cd /home/YOUR_USERNAME/mandi2mandi/project
python3 migrations/verify_and_migrate_cart.py
```

### Reload Flask app:
- Go to PythonAnywhere Web tab
- Click **"Reload"**

---

## Step 2: Frontend (3 minutes)

### Build:
```bash
cd home/simple4j/mandi2mandi
npm run build
```

### Deploy:
```bash
# For Vercel (automatic)
git add .
git commit -m "Add cart system and direct buy"
git push

# For Firebase
firebase deploy
```

---

## Step 3: Verify (30 seconds)

1. Visit your website
2. Go to `/products`
3. Click any product
4. **Should see:** Clean buy page, NO inquiry buttons ✅
5. Add to cart ✅
6. View cart icon in header ✅

---

## What Changed:

### Frontend:
- ❌ Removed "Send Purchase Inquiry"
- ❌ Removed "Unlock Contact"
- ✅ Added "Add to Cart" on product cards
- ✅ Added clean buy page
- ✅ Added cart system
- ✅ Added minimum quantity 2000

### Backend:
- ✅ Added 2 new tables (`carts`, `cart_items`)
- ✅ Added cart API endpoints
- ✅ Updated payment to support cart
- ✅ All existing data SAFE

---

## Files Changed:

**Backend (4):**
- `api/models.py` - Added Cart models
- `api/cart.py` - NEW cart API
- `api/payments.py` - Cart checkout
- `api/__init__.py` - Register cart routes

**Frontend (6):**
- `src/components/product-buy-page.tsx` - NEW
- `src/components/product-card.tsx` - Updated
- `src/components/header.tsx` - Cart icon
- `src/app/order/[id]/page.tsx` - Use new page
- `src/app/cart/page.tsx` - NEW
- `src/app/cart/checkout/page.tsx` - NEW
- `src/contexts/CartContext.tsx` - NEW
- `src/app/layout.tsx` - Cart provider

---

## Troubleshooting:

**Still see inquiry page?**
→ Hard refresh (Ctrl+Shift+R)

**Cart not working?**
→ Check backend deployed and running

**Payment failing?**
→ Verify PayU credentials in config.py

---

## Done! 🎉

Your website now has:
- ✅ Direct buy (no inquiry)
- ✅ Shopping cart
- ✅ Minimum quantity 2000
- ✅ Address collection
- ✅ Payment integration

**Total time:** < 5 minutes
**Risk:** Zero (no data loss)
**Result:** Modern e-commerce experience
