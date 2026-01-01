#!/bin/bash

echo "================================================"
echo "  Deploying Mandi2Mandi Frontend - Direct Buy"
echo "================================================"
echo ""

# Step 1: Clean previous build
echo "Step 1: Cleaning previous build..."
rm -rf .next
echo "✓ Cleaned"
echo ""

# Step 2: Build
echo "Step 2: Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo ""
echo "✓ Build successful!"
echo ""

# Step 3: Git commit
echo "Step 3: Committing changes..."
git add .
git commit -m "Remove inquiry system, add direct buy with cart"

echo ""
echo "✓ Changes committed"
echo ""

# Step 4: Deploy
echo "Step 4: Choose deployment method:"
echo "  1) Git push (for Vercel auto-deploy)"
echo "  2) Firebase deploy"
echo "  3) Skip deployment"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Pushing to Git..."
        git push
        echo ""
        echo "✓ Pushed to Git. Vercel will auto-deploy."
        echo "  Check: https://vercel.com/dashboard"
        ;;
    2)
        echo ""
        echo "Deploying to Firebase..."
        firebase deploy --only hosting
        ;;
    3)
        echo ""
        echo "Skipped deployment. Run 'git push' or 'firebase deploy' manually."
        ;;
    *)
        echo ""
        echo "Invalid choice. Run 'git push' or 'firebase deploy' manually."
        ;;
esac

echo ""
echo "================================================"
echo "  Deployment Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Wait 5-10 minutes for CDN propagation"
echo "  2. Clear browser cache (Ctrl+Shift+R)"
echo "  3. Visit: https://mandi2mandi.com/order/231843"
echo "  4. Verify NO inquiry buttons shown"
echo ""
echo "Expected changes:"
echo "  ✓ Clean buy page with quantity selector"
echo "  ✓ 'Buy Now' and 'Add to Cart' buttons"
echo "  ✓ Minimum quantity 2000 enforced"
echo "  ❌ NO 'Send Purchase Inquiry'"
echo "  ❌ NO 'Unlock Contact'"
echo ""
echo "Happy selling! 🚀"
