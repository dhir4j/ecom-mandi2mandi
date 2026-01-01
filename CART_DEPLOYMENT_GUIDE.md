# Cart System Deployment Guide

## Overview
The cart system has been successfully implemented with the following features:
- Direct "Add to Cart" functionality on product cards
- Minimum quantity validation (2000 per item)
- Shopping cart page with quantity management
- Cart checkout with payment integration
- Cart icon in header with item count badge
- Removed the inquiry/unlock contact system from the frontend

## Changes Made

### Backend Changes

1. **Database Models** (`project/api/models.py`)
   - Added `Cart` model
   - Added `CartItem` model

2. **API Endpoints** (`project/api/cart.py`)
   - `GET /api/cart` - Get user's cart
   - `POST /api/cart/add` - Add item to cart
   - `PUT /api/cart/update/<id>` - Update cart item quantity
   - `DELETE /api/cart/remove/<id>` - Remove item from cart
   - `DELETE /api/cart/clear` - Clear entire cart
   - `GET /api/cart/count` - Get cart item count

3. **Payment Integration** (`project/api/payments.py`)
   - Added `POST /api/initiate-cart-payment` - Initiate payment for entire cart
   - Updated payment success handlers to clear cart after successful payment
   - Support for PayU, SabPaisa, and Airpay gateways

4. **Migration Script** (`project/migrations/add_cart_tables.py`)
   - Creates `carts` and `cart_items` tables

5. **App Registration** (`project/api/__init__.py`)
   - Registered cart blueprint
   - Imported Cart and CartItem models

### Frontend Changes

1. **Cart Context** (`src/contexts/CartContext.tsx`)
   - Global cart state management
   - Cart operations (add, update, remove, clear)
   - Minimum quantity validation (2000)
   - API integration

2. **Product Card** (`src/components/product-card.tsx`)
   - Replaced "Buy Now" with "Add to Cart"
   - Added quantity input with +/- buttons
   - Minimum quantity validation
   - Real-time subtotal calculation

3. **Cart Page** (`src/app/cart/page.tsx`)
   - View all cart items
   - Update quantities
   - Remove items
   - Clear cart
   - Order summary
   - Proceed to checkout

4. **Cart Checkout** (`src/app/cart/checkout/page.tsx`)
   - Collect delivery information
   - Payment gateway selection
   - Order summary
   - Payment initiation

5. **Header** (`src/components/header.tsx`)
   - Cart icon with item count badge
   - Available in both desktop and mobile views

6. **App Layout** (`src/app/layout.tsx`)
   - Wrapped app with CartProvider

## Deployment Steps

### 1. Backend Deployment (PythonAnywhere)

1. **Upload the modified files:**
   ```bash
   # Upload these files to your PythonAnywhere account:
   - project/api/models.py
   - project/api/cart.py
   - project/api/payments.py
   - project/api/__init__.py
   - project/migrations/add_cart_tables.py
   ```

2. **Run the database migration:**
   ```bash
   # SSH into PythonAnywhere or use the bash console
   cd /home/YOUR_USERNAME/mandi2mandi/project
   python3 migrations/add_cart_tables.py
   ```

3. **Reload the Flask app:**
   - Go to PythonAnywhere Web tab
   - Click "Reload" button

### 2. Frontend Deployment (Vercel/Firebase)

1. **Build the Next.js app:**
   ```bash
   cd home/simple4j/mandi2mandi
   npm run build
   ```

2. **Deploy to your hosting platform:**
   - **For Vercel:** Push changes to your Git repository (auto-deploys)
   - **For Firebase:** Run `firebase deploy`

### 3. Verification Steps

1. **Test Backend APIs:**
   ```bash
   # Test cart creation (requires authentication)
   curl -X GET https://YOUR_BACKEND_URL/api/cart \
     -H "Cookie: session=YOUR_SESSION_COOKIE"
   ```

2. **Test Frontend:**
   - Login to your account
   - Navigate to Products page
   - Add items to cart (minimum 2000 quantity)
   - View cart at `/cart`
   - Proceed to checkout
   - Complete payment flow

## Configuration

### Environment Variables

Make sure these are set:

**Backend (`config.py`):**
```python
# Database
DATABASE_URL = "postgresql://..."

# PayU
PAYU_KEY = "your_key"
PAYU_SALT = "your_salt"

# SabPaisa (optional)
SABPAISA_CLIENT_CODE = "your_code"
SABPAISA_AUTH_KEY = "your_key"
SABPAISA_AUTH_IV = "your_iv"

# Airpay (optional)
AIRPAY_MERCHANT_ID = "your_merchant_id"
AIRPAY_SECRET_KEY = "your_secret_key"
```

**Frontend (`.env.local`):**
```bash
NEXT_PUBLIC_API_BASE_URL=https://YOUR_BACKEND_URL
```

## Key Features

### 1. Minimum Quantity Validation
- **Backend:** Validates in `cart.py` (line 26)
- **Frontend:** Validates in `CartContext.tsx` (line 106)
- **Value:** 2000 units per item

### 2. Payment Gateway Support
- PayU (default)
- SabPaisa
- Airpay V4

### 3. Cart Persistence
- Cart is stored in PostgreSQL database
- Survives browser refresh
- Tied to user account

### 4. Automatic Cart Clearing
- Cart is automatically cleared after successful payment
- Happens in payment success callback

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PUT | `/api/cart/update/<id>` | Update cart item | Yes |
| DELETE | `/api/cart/remove/<id>` | Remove cart item | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |
| GET | `/api/cart/count` | Get cart count | Yes |
| POST | `/api/initiate-cart-payment` | Start payment | Yes |

## Database Schema

### `carts` Table
```sql
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `cart_items` Table
```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price_per_unit FLOAT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    quantity FLOAT NOT NULL,
    image_url VARCHAR(500),
    seller_name VARCHAR(150),
    location VARCHAR(200),
    created_on TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/products` | Product listing with "Add to Cart" |
| `/cart` | Shopping cart page |
| `/cart/checkout` | Cart checkout page |

## Troubleshooting

### Issue: Cart not loading
**Solution:**
- Check if backend API is running
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check browser console for CORS errors

### Issue: Can't add to cart
**Solution:**
- Ensure user is logged in
- Check quantity is >= 2000
- Verify backend cart API is accessible

### Issue: Payment not working
**Solution:**
- Check payment gateway credentials in `config.py`
- Verify cart has items before checkout
- Check backend logs for payment errors

### Issue: Cart count not updating
**Solution:**
- Check CartContext is properly wrapped in layout
- Verify cart API endpoints are returning correct data
- Clear browser cache and reload

## Testing Checklist

- [ ] User can add items to cart (quantity >= 2000)
- [ ] Cart icon shows correct item count
- [ ] Cart page displays all items correctly
- [ ] User can update quantities in cart
- [ ] User can remove items from cart
- [ ] User can clear entire cart
- [ ] Cart checkout collects delivery info
- [ ] Payment gateway redirects properly
- [ ] Cart is cleared after successful payment
- [ ] Cart persists after browser refresh

## Next Steps

1. Deploy backend changes to PythonAnywhere
2. Run database migration
3. Deploy frontend to Vercel/Firebase
4. Test the complete cart flow
5. Monitor for any errors in production

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs on PythonAnywhere
3. Verify database tables were created correctly
4. Test API endpoints individually

---

**Implementation Date:** January 1, 2026
**Minimum Quantity:** 2000 units
**Payment Gateways:** PayU, SabPaisa, Airpay V4
