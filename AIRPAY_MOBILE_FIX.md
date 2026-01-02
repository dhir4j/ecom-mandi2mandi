# Airpay Mobile Number Fix

## Issue
Airpay payment gateway was showing **"Invalid number"** error because we were sending a placeholder number `0000000000` instead of a real mobile number.

## Solution
Added a mobile number input field in the payment modal that:
1. **Appears before payment gateway selection** - Clearly visible with blue background
2. **Validates input in real-time** - Shows character count and validation status
3. **Only accepts 10 digits** - Auto-filters non-numeric characters
4. **Validates Indian mobile format** - Must start with 6, 7, 8, or 9
5. **Required for Airpay** - Frontend and backend both validate before payment

---

## Changes Made

### Frontend (`src/components/product-details-page.tsx`)

#### 1. Added State for Mobile Number (Line 56)
```typescript
const [mobileNumber, setMobileNumber] = useState<string>('');
```

#### 2. Added Validation Before Payment (Lines 201-222)
```typescript
const handlePaymentGatewaySelect = async (gateway: 'payu' | 'sabpaisa' | 'airpay') => {
  // For Airpay, validate mobile number first
  if (gateway === 'airpay') {
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      toast({
        title: 'Mobile Number Required',
        description: 'Please enter a valid 10-digit mobile number for Airpay payment',
        variant: 'destructive',
      });
      return;
    }
    // Validate it starts with 6-9 (Indian mobile format)
    if (!['6', '7', '8', '9'].includes(cleanMobile[0])) {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9',
        variant: 'destructive',
      });
      return;
    }
  }
  // ... rest of payment logic
};
```

#### 3. Include Mobile in Payment Data (Line 237)
```typescript
const paymentData = {
  product_id: product.id,
  product_name: product.title,
  quantity: quantity,
  unit: product.unit,
  price_per_unit: product.price,
  total_amount: totalAmount,
  gateway: gateway,
  mobile: gateway === 'airpay' ? mobileNumber.replace(/\D/g, '') : undefined,
};
```

#### 4. Added Input Field in Payment Modal (Lines 910-932)
```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
  <label htmlFor="mobile" className="block text-sm font-medium mb-2">
    Mobile Number <span className="text-red-500">*</span>
    <span className="text-xs text-muted-foreground">(Required for Airpay)</span>
  </label>
  <input
    id="mobile"
    type="tel"
    placeholder="Enter 10-digit mobile number"
    value={mobileNumber}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, '');
      if (value.length <= 10) {
        setMobileNumber(value);
      }
    }}
    maxLength={10}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm..."
  />
  <p className="text-xs text-muted-foreground mt-1">
    {mobileNumber.length === 10 ? '✓ Valid number' : `${mobileNumber.length}/10 digits`}
  </p>
</div>
```

---

### Backend (`project/api/payments.py`)

#### Added Mobile Validation (Lines 316-331)
```python
elif gateway == 'airpay':
    # Get mobile number from request (required for Airpay)
    buyer_phone = data.get('mobile', '').strip()

    # Validate mobile number
    if not buyer_phone or len(buyer_phone) != 10:
        return jsonify({'error': 'Valid 10-digit mobile number is required for Airpay'}), 400

    # Ensure it's all digits
    if not buyer_phone.isdigit():
        return jsonify({'error': 'Mobile number must contain only digits'}), 400

    # Validate Indian mobile format (starts with 6-9)
    if buyer_phone[0] not in ['6', '7', '8', '9']:
        return jsonify({'error': 'Mobile number must start with 6, 7, 8, or 9'}), 400

    print(f"[AIRPAY] Using mobile number: {buyer_phone}")

    # Build Airpay V4 payment request
    airpay_params = build_airpay_request(
        # ... other params ...
        buyer_phone=buyer_phone,  # Use real mobile number from user
        # ... other params ...
    )
```

---

## How It Works Now

### User Flow:
1. User clicks "Buy Now" on product page
2. **Payment modal opens with mobile input field at the top**
3. User enters their 10-digit mobile number
4. Input validates in real-time:
   - Shows "X/10 digits" while typing
   - Shows "✓ Valid number" when complete
5. User clicks on payment gateway button (PayU/SabPaisa/Airpay)
6. **For Airpay only:** Frontend validates mobile number:
   - Must be exactly 10 digits
   - Must start with 6, 7, 8, or 9
   - Shows error toast if invalid
7. If valid, sends mobile to backend
8. **Backend validates again** before calling Airpay
9. Mobile number is sent to Airpay V4 API
10. Airpay accepts the number and shows payment page

---

## Visual Example

**Payment Modal Now Looks Like:**

```
┌─────────────────────────────────────────┐
│  Select Payment Gateway                 │
│  Choose your preferred payment method   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Mobile Number * (Required for   │   │
│  │              Airpay)            │   │
│  │                                 │   │
│  │ [9876543210_____________]       │   │
│  │                                 │   │
│  │ ✓ Valid number                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💳 PayU                         │   │
│  │ Credit/Debit Card, UPI, Net...  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💳 SabPaisa                     │   │
│  │ All Payment Methods             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💳 Airpay                       │   │
│  │ UPI, Cards, Wallets             │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Validation Rules

### Frontend Validation:
- ✅ Only numeric digits allowed (auto-strips non-numeric)
- ✅ Maximum 10 characters
- ✅ Must be exactly 10 digits for Airpay
- ✅ Must start with 6, 7, 8, or 9
- ✅ Shows error toast before payment

### Backend Validation:
- ✅ Checks if mobile is present
- ✅ Checks if exactly 10 digits
- ✅ Checks if all digits (no letters/symbols)
- ✅ Checks if starts with 6-9
- ✅ Returns 400 error if invalid

---

## Testing

### Test Valid Numbers:
- ✅ `9876543210` - Valid
- ✅ `8765432109` - Valid
- ✅ `7654321098` - Valid
- ✅ `6543210987` - Valid

### Test Invalid Numbers (Will Show Error):
- ❌ `5432109876` - Starts with 5 (invalid)
- ❌ `123456789` - Only 9 digits
- ❌ `12345678901` - 11 digits (auto-truncated to 10)
- ❌ `98765abcde` - Contains letters (auto-filtered)

---

## Build Status

✅ **Frontend Build:** Successful
✅ **No TypeScript Errors**
✅ **No Lint Errors**
✅ **Production Ready**

---

## Deployment

### Backend:
```bash
cd project
git add .
git commit -m "Add mobile number validation for Airpay payments"
git push
# Reload PythonAnywhere web app
```

### Frontend:
```bash
# Build is already complete in .next/ folder
vercel --prod
# or
firebase deploy --only hosting
```

---

## API Changes

### Before:
```json
POST /api/initiate-payment
{
  "product_id": 123,
  "product_name": "Product",
  "quantity": 10,
  "total_amount": 5000
}
```

### After (for Airpay):
```json
POST /api/initiate-payment
{
  "product_id": 123,
  "product_name": "Product",
  "quantity": 10,
  "total_amount": 5000,
  "mobile": "9876543210"  ← NEW REQUIRED FIELD
}
```

---

## Success Criteria

✅ Mobile input field appears in payment modal
✅ Real-time validation shows character count
✅ Frontend blocks Airpay payment without valid mobile
✅ Backend validates mobile before calling Airpay API
✅ Airpay gateway receives valid 10-digit Indian mobile
✅ No more "Invalid number" errors on Airpay page

---

Generated: 2026-01-02
