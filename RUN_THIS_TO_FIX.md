# FIX: Remove "Send Purchase Inquiry" Buttons

## The Issue

Your production site at `https://mandi2mandi.com/order/231843` still shows:
- ❌ "Send Purchase Inquiry" button
- ❌ "Unlock Contact" button

## The Fix (Run These Commands)

### Option 1: Automatic Deployment Script

```bash
cd /home/dhir4j/Documents/programs/mandi2mandi/home/simple4j/mandi2mandi
./deploy.sh
```

This script will:
1. Clean previous build
2. Build the frontend
3. Commit changes
4. Deploy (you choose method)

---

### Option 2: Manual Commands

```bash
# Navigate to frontend
cd /home/dhir4j/Documents/programs/mandi2mandi/home/simple4j/mandi2mandi

# Clean and build
rm -rf .next
npm run build

# Commit changes
git add .
git commit -m "Remove inquiry system, add direct buy"

# Deploy (choose one):

# For Vercel:
git push

# For Firebase:
firebase deploy --only hosting
```

---

## What Will Change

### Current (Production):
```
┌────────────────────────────────────┐
│ Product Image                      │
│                                    │
│ Interested in this product?        │
│ Contact the seller...              │
│                                    │
│ [Send Purchase Inquiry]  ← REMOVE │
│ [🔒 Unlock Contact]      ← REMOVE │
│                                    │
│ Subscribe for ₹199/month...        │
└────────────────────────────────────┘
```

### After Deploy (New):
```
┌────────────────────────────────────┐
│ [Product Images]  │  Product Name  │
│                   │  ₹50 / Kg      │
│ [Thumbnails]      │                │
│                   │  Min: 2000 Kg  │
│                   │                │
│                   │  Quantity:     │
│                   │  [2000] [- +]  │
│                   │  Total: ₹100K  │
│                   │                │
│                   │  [Buy Now]     │
│                   │  [Add to Cart] │
└────────────────────────────────────┘
```

---

## Verification

After deploying, wait 5-10 minutes, then:

1. **Clear browser cache:**
   - Press `Ctrl + Shift + R` (hard refresh)

2. **Visit the page:**
   - `https://mandi2mandi.com/order/231843`

3. **You should see:**
   - ✅ Clean product page
   - ✅ Quantity selector
   - ✅ "Buy Now" button
   - ✅ "Add to Cart" button
   - ✅ Minimum 2000 enforced
   - ❌ NO "Send Purchase Inquiry"
   - ❌ NO "Unlock Contact"
   - ❌ NO subscription message

4. **Test functionality:**
   - Set quantity to 2000
   - Click "Buy Now"
   - Should show address form
   - Fill address and pay

---

## Why This Happened

The code was updated locally but **not deployed to production**.

**Local files** (on your computer):
- ✅ Already updated with new buy page
- ✅ Inquiry system removed

**Production** (mandi2mandi.com):
- ❌ Still has old code
- ❌ Still shows inquiry buttons

**Solution:** Deploy the local files to production!

---

## Files That Were Updated

These files have the new code locally:
1. `src/app/order/[id]/page.tsx` - Uses new ProductBuyPage
2. `src/components/product-buy-page.tsx` - Clean buy page (NEW)
3. `src/components/product-card.tsx` - Add to Cart
4. `src/contexts/CartContext.tsx` - Cart system (NEW)
5. `src/app/cart/page.tsx` - Cart page (NEW)
6. `src/components/header.tsx` - Cart icon

They just need to be **built and deployed**.

---

## Expected Timeline

| Step | Time |
|------|------|
| Build | 1-3 minutes |
| Deploy | 2-5 minutes |
| CDN propagation | 5-10 minutes |
| **Total** | **10-15 minutes** |

---

## Troubleshooting

### "npm: command not found"

```bash
# Install Node.js first
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Build failed"

```bash
# Install dependencies
npm install
npm run build
```

### "Still seeing old page"

1. Hard refresh: `Ctrl + Shift + R`
2. Clear cache completely
3. Wait 10 more minutes (CDN cache)
4. Try incognito mode

---

## Quick Check Before Deploying

Verify files exist locally:

```bash
# Check new buy page exists
ls -la src/components/product-buy-page.tsx

# Check order page was updated
cat src/app/order/[id]/page.tsx | grep "ProductBuyPage"

# Should output:
# import { ProductBuyPage } from '@/components/product-buy-page';
# return <ProductBuyPage product={product} />;
```

If these checks pass → **Ready to deploy!**

---

## Summary

**Current state:** Files updated locally ✅
**Next step:** Build and deploy to production
**Time needed:** 15 minutes
**Commands:** See "Option 1" or "Option 2" above

Run the deployment commands now! 🚀
