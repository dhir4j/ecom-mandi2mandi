# Database Changes Summary

## TL;DR
**SAFE TO DEPLOY** - Only 2 new tables added, no existing tables modified.

---

## Existing Tables (NOT MODIFIED - 100% SAFE)

| Table | Status | Your Data |
|-------|--------|-----------|
| `users` | ✅ **NO CHANGE** | **SAFE** - All users preserved |
| `products` | ✅ **NO CHANGE** | **SAFE** - All products preserved |
| `images` | ✅ **NO CHANGE** | **SAFE** - All images preserved |
| `orders` | ✅ **NO CHANGE** | **SAFE** - All orders preserved |
| `inquiries` | ✅ **NO CHANGE** | **SAFE** - All inquiries preserved |
| `chat_messages` | ✅ **NO CHANGE** | **SAFE** - All messages preserved |

---

## New Tables (ADDED)

### 1. `carts` Table
Stores shopping cart for each user.

```sql
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Purpose:** One cart per user
**Relationships:** Links to `users` table
**Impact on existing data:** NONE

---

### 2. `cart_items` Table
Stores items in each cart.

```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price_per_unit FLOAT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    quantity FLOAT NOT NULL CHECK (quantity >= 2000),
    image_url VARCHAR(500),
    seller_name VARCHAR(150),
    location VARCHAR(200),
    created_on TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Purpose:** Multiple items per cart
**Relationships:** Links to `carts` table
**Minimum Quantity:** 2000 units enforced
**Impact on existing data:** NONE

---

## Database Schema Comparison

### BEFORE (6 tables):
```
users
├── products (seller's products)
├── orders (buyer's orders)
├── inquiries (buyer inquiries)
└── chat_messages (inquiry chats)

products
└── images
```

### AFTER (8 tables):
```
users
├── products (seller's products)
├── orders (buyer's orders)
├── inquiries (buyer inquiries)
├── chat_messages (inquiry chats)
└── carts ← NEW
    └── cart_items ← NEW

products
└── images
```

---

## Modified Code Files

### Backend Files Modified:

#### 1. `api/models.py`
**What changed:** Added 2 new model classes
```python
# ADDED (lines 148-202):
class Cart(db.Model):
    # Shopping cart model
    pass

class CartItem(db.Model):
    # Cart items model
    pass

# EXISTING MODELS NOT MODIFIED:
class User(db.Model):        # ✅ NO CHANGE
class Product(db.Model):     # ✅ NO CHANGE
class Image(db.Model):       # ✅ NO CHANGE
class Order(db.Model):       # ✅ NO CHANGE
class Inquiry(db.Model):     # ✅ NO CHANGE
class ChatMessage(db.Model): # ✅ NO CHANGE
```

#### 2. `api/__init__.py`
**What changed:** Registered cart blueprint
```python
# ADDED:
from .models import Cart, CartItem  # Import new models
from .cart import cart_bp           # Import cart blueprint
app.register_blueprint(cart_bp)     # Register cart routes
```

#### 3. `api/payments.py`
**What changed:** Added cart checkout endpoint
```python
# ADDED (line 7):
from .models import Cart, CartItem

# ADDED (lines 348-484):
@payments_bp.route('/initiate-cart-payment', methods=['POST'])
def initiate_cart_payment():
    # Cart payment logic
    pass

# MODIFIED (lines 507-511):
# Clear cart after successful payment
if user_cart:
    CartItem.query.filter_by(cart_id=user_cart.id).delete()
```

#### 4. `api/cart.py` (NEW FILE)
**What changed:** Completely new file
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/<id>` - Update item
- `DELETE /api/cart/remove/<id>` - Remove item
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/count` - Get count

---

## Migration Safety

### Why It's Safe:

1. **SQLAlchemy's `db.create_all()` behavior:**
   ```python
   db.create_all()  # Only creates tables that DON'T exist
   ```
   - Does NOT drop existing tables
   - Does NOT modify existing tables
   - Only creates missing tables

2. **No data migration needed:**
   - Cart tables start empty
   - No need to copy data from old tables

3. **Foreign keys are safe:**
   - `carts.user_id` → `users.id` (read-only reference)
   - Doesn't modify `users` table

4. **Cascade deletes are contained:**
   - If cart deleted → cart_items deleted
   - Does NOT affect users, products, or orders

---

## Data Flow

### Old Flow (Still Works):
```
Product → Direct Order → Payment → Order Record
```

### New Flow (Added):
```
Product → Cart → Cart Items → Cart Checkout → Payment → Order Records + Clear Cart
```

Both flows create the same `Order` records in the database.

---

## Verification Query

After migration, run this SQL to verify:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected result (8 tables):
-- cart_items
-- carts
-- chat_messages
-- images
-- inquiries
-- orders
-- products
-- users

-- Count rows in existing tables (should be unchanged)
SELECT
    'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'inquiries', COUNT(*) FROM inquiries;

-- Check new tables (should be empty initially)
SELECT
    'carts' as table_name, COUNT(*) FROM carts
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items;
```

---

## Rollback Information

If you need to rollback (unlikely):

### Remove cart tables:
```sql
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
```

### Remove cart code:
- Delete `api/cart.py`
- Remove cart imports from `api/__init__.py`
- Remove cart imports from `api/payments.py`

**Your existing data remains 100% intact.**

---

## Summary Table

| Action | Tables Affected | Data at Risk | Safety Level |
|--------|----------------|--------------|--------------|
| Add `carts` table | 0 existing | None | ✅ 100% Safe |
| Add `cart_items` table | 0 existing | None | ✅ 100% Safe |
| Modify existing tables | 0 | None | ✅ Nothing modified |
| Delete existing data | 0 | None | ✅ Nothing deleted |

---

## Conclusion

✅ **SAFE TO DEPLOY**
- Zero risk to existing data
- Zero changes to existing tables
- Fully reversible
- Production-ready

Your users, products, orders, and all existing data will remain exactly as they are. The cart system is a completely separate, additive feature.
