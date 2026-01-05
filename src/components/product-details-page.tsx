'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CategoryProductCarousel } from '@/components/category-product-carousel';
import { SubscriptionPaywall } from '@/components/subscription-paywall';
import { InquiryFormModal } from '@/components/inquiry-form-modal';
import { InquiryChatInterface } from '@/components/inquiry-chat-interface';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, Tag, Package, Lock, ShoppingBag, MessageSquare, ShoppingCart, RefreshCw, Minus, Plus, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { InquiryTutorialModal } from '@/components/inquiry-tutorial-modal';
import { useCart } from '@/contexts/CartContext';

type ProductDetailsPageProps = {
  product: Product;
  relatedProducts: Product[];
};

// Simple gray placeholder as data URI
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

// Generate product description from template
function generateProductDescription(product: Product): string {
  return `I have the availability of ${product.title} for sale in ${product.location}. The product is available at Rs. ${product.price.toLocaleString('en-IN')} per ${product.unit}. For further discussions, interested genuine buyers, please contact on the given details.`;
}

export function ProductDetailsPage({ product, relatedProducts }: ProductDetailsPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showContactNumber, setShowContactNumber] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [userInquiry, setUserInquiry] = useState<any>(null);
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'payu' | 'sabpaisa' | 'airpay' | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const description = generateProductDescription(product);

  // Fetch user's inquiry for this product - USING THE SAME API AS MY-INQUIRIES PAGE
  const fetchUserInquiry = async () => {
    if (!isAuthenticated || !user?.id) {
      console.log('Not fetching inquiry - user not authenticated or no user ID');
      setIsLoadingInquiry(false);
      return;
    }

    setIsLoadingInquiry(true);
    console.log('=== FETCHING INQUIRIES (SAME API AS MY-INQUIRIES) ===');
    console.log('Product ID:', product.id);

    try {
      // USE THE EXACT SAME ENDPOINT AS MY-INQUIRIES PAGE
      const response = await fetch(
        'https://www.mandi.ramhotravels.com/api/inquiries/my-inquiries',
        {
          credentials: 'include',
        }
      );

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fetched inquiries:', data.inquiries?.length || 0, 'total');

        if (data.inquiries && data.inquiries.length > 0) {
          // Filter for this specific product
          const productInquiries = data.inquiries.filter((inq: any) => {
            const inqProductId = String(inq.productId).trim();
            const currentProductId = String(product.id).trim();
            return inqProductId === currentProductId;
          });

          console.log('📦 Found', productInquiries.length, 'inquiry(ies) for product', product.id);

          if (productInquiries.length > 0) {
            // Get the most recent one
            const inquiry = productInquiries.sort((a: any, b: any) =>
              new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
            )[0];

            console.log('✅ Setting inquiry:', inquiry.inquiryId, 'Status:', inquiry.status);
            setUserInquiry(inquiry);
          } else {
            console.log('ℹ️ No inquiry for this product yet');
            setUserInquiry(null);
          }
        } else {
          console.log('ℹ️ No inquiries found at all');
          setUserInquiry(null);
        }
      } else {
        console.error('❌ Failed to fetch - HTTP status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching inquiries:', error);
    } finally {
      setIsLoadingInquiry(false);
    }
  };

  useEffect(() => {
    fetchUserInquiry();
  }, [isAuthenticated, user?.id, product.id]);

  // New Buy handlers
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    setLoading(true);
    const result = await addToCart({
      productId: product.id,
      productName: product.title,
      pricePerUnit: product.price,
      unit: product.unit,
      quantity: quantity,
      imageUrl: product.images?.[0] || '',
      sellerName: product.sellerName || '',
      location: product.location || '',
    });

    setLoading(false);

    if (result.success) {
      toast({
        title: 'Added to Cart',
        description: `${quantity} ${product.unit} of ${product.title} added to cart`,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  const handleDirectBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    // Show payment gateway selection modal
    setShowPaymentModal(true);
  };

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

    setSelectedGateway(gateway);
    setBuyNowLoading(true);

    try {
      const totalAmount = product.price * quantity;
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

      let endpoint = '';
      if (gateway === 'payu') {
        endpoint = 'https://www.mandi.ramhotravels.com/api/initiate-payu-payment';
      } else if (gateway === 'sabpaisa') {
        endpoint = 'https://www.mandi.ramhotravels.com/api/initiate-sabpaisa-payment';
      } else if (gateway === 'airpay') {
        endpoint = 'https://www.mandi.ramhotravels.com/api/initiate-payment'; // Airpay
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to initiate payment');
      }

      const data = await response.json();
      console.log(`${gateway.toUpperCase()} Response:`, data);

      if (!data.payment_url) {
        throw new Error('No payment URL received from server');
      }

      // Create a form and submit it to the payment gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.payment_url;

      // Add all parameters to the form
      Object.keys(data).forEach((key) => {
        if (key !== 'payment_url') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      console.log(`Submitting ${gateway.toUpperCase()} payment form to:`, data.payment_url);
      form.submit();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
      setShowPaymentModal(false);
      setBuyNowLoading(false);
      setSelectedGateway(null);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to contact sellers',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    // Check if user has active subscription
    if (user?.hasSubscription) {
      // Show contact number
      setShowContactNumber(true);
      toast({
        title: 'Contact Number',
        description: 'Seller contact number is now visible',
      });
    } else {
      // Show paywall
      setShowPaywall(true);
    }
  };

  const handleSendInquiry = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to send inquiries',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    // Check if this is the first time user is sending an inquiry
    const hasSeenTutorial = localStorage.getItem('hasSeenInquiryTutorial');

    if (!hasSeenTutorial) {
      // Show tutorial for first-time users
      setShowTutorial(true);
      localStorage.setItem('hasSeenInquiryTutorial', 'true');
    } else {
      // Directly open inquiry form for returning users
      setShowChatModal(true);
    }
  };

  const handleBuyNow = async () => {
    if (!userInquiry || !user?.email) {
      alert('Unable to proceed. Please try again.');
      return;
    }

    try {
      // Create PayU payment for this inquiry (use finalTotal if shipping added, otherwise estimatedPrice)
      const paymentAmount = userInquiry.finalTotal || userInquiry.estimatedPrice;
      const payuParams = {
        txnid: `INQ${userInquiry.id}_${Date.now()}`,
        amount: paymentAmount.toFixed(2),
        productinfo: `${userInquiry.productName} - ${userInquiry.quantity} ${userInquiry.unit}`,
        firstname: userInquiry.buyerName,
        email: user.email,
        phone: userInquiry.mobile || '0000000000',
        surl: 'https://www.mandi.ramhotravels.com/api/inquiry-payment-success',
        furl: 'https://www.mandi.ramhotravels.com/api/inquiry-payment-failure',
      };

      // Call backend to generate hash
      const response = await fetch('https://www.mandi.ramhotravels.com/api/get-payu-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...payuParams,
          udf1: userInquiry.id.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { hash, payuUrl, merchantKey } = await response.json();

      // Create form and submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuUrl;

      const params = {
        key: merchantKey,
        ...payuParams,
        hash,
        udf1: userInquiry.id.toString(),
      };

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const handleChatWithSeller = () => {
    if (!userInquiry) return;
    setShowChatInterface(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        {/* Back Button */}
        <div className="bg-background border-b sticky top-16 z-30">
          <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
            <Button variant="ghost" size="sm" asChild className="h-8 md:h-9">
              <Link href="/products">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">Back</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Product Details Section - More Compact */}
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-5">
            {/* Left Column - Images (Reduced by 15%) */}
            <div className="lg:col-span-2 space-y-2 md:space-y-3">
              {/* Main Image - 15% smaller in both dimensions */}
              <div className="relative w-[85%] max-w-sm mx-auto lg:max-w-none aspect-[4/3] bg-muted rounded-lg overflow-hidden border">
                <Image
                  src={imageErrors.has(selectedImage) ? PLACEHOLDER_IMAGE : (product.images[selectedImage] || PLACEHOLDER_IMAGE)}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 85vw, 35vw"
                  priority
                  unoptimized
                  onError={() => {
                    setImageErrors(prev => new Set(prev).add(selectedImage));
                  }}
                />
              </div>

              {/* Thumbnail Images - Smaller */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1.5 md:gap-2 w-[85%] max-w-sm mx-auto lg:max-w-none">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={imageErrors.has(index) ? PLACEHOLDER_IMAGE : image}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(index));
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info (More Compact) */}
            <div className="lg:col-span-3 space-y-3">
              {/* Header Section with Title and Badges */}
              <div className="space-y-2">
                {/* Category & Subcategory Badges - Clickable */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                    <Badge variant="secondary" className="text-xs capitalize py-0.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {product.category}
                    </Badge>
                  </Link>
                  <Link href={`/products?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`}>
                    <Badge variant="outline" className="text-xs capitalize py-0.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Tag className="h-3 w-3 mr-1" />
                      {product.subcategory}
                    </Badge>
                  </Link>

                  {/* Inquiry Status Badge */}
                  {userInquiry && (
                    <Badge
                      variant={
                        userInquiry.status?.toLowerCase() === 'approved' ? 'default' :
                        userInquiry.status?.toLowerCase() === 'pending' ? 'secondary' :
                        'destructive'
                      }
                      className="text-xs py-0.5"
                    >
                      {userInquiry.status?.toLowerCase() === 'approved' && '✓ '}
                      Inquiry: {userInquiry.status}
                    </Badge>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-headline leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Price Card - Compact */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Price</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-base text-muted-foreground">
                          / {product.unit}
                        </span>
                      </div>
                    </div>
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Information Grid - Compact */}
              <Card>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm md:text-base mb-2.5 flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Product Details
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Location */}
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                      <div className="bg-primary/10 p-1.5 rounded">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground">Location</p>
                        <p className="text-xs font-semibold truncate">{product.location}</p>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                      <div className="bg-primary/10 p-1.5 rounded">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground">Seller</p>
                        <p className="text-xs font-semibold truncate">{product.seller}</p>
                      </div>
                    </div>

                    {/* Listed Date */}
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                      <div className="bg-primary/10 p-1.5 rounded">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground">Listed On</p>
                        <p className="text-xs font-semibold truncate">{product.date}</p>
                      </div>
                    </div>

                    {/* Unit */}
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                      <div className="bg-primary/10 p-1.5 rounded">
                        <Package className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground">Unit</p>
                        <p className="text-xs font-semibold capitalize truncate">{product.unit}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Description - Compact */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm md:text-base flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Product Description
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {description}
                  </p>
                </CardContent>
              </Card>

              {/* Contact Section */}
              <Card id="contact-section" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="font-semibold text-base md:text-lg">Interested in this product?</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Contact the seller directly to discuss pricing, quantity, and delivery details.
                  </p>

                  {/* Show contact number if user has subscription or just revealed it */}
                  {(user?.hasSubscription || showContactNumber) && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                            Seller Contact Number:
                          </p>
                          <a
                            href="tel:8827095122"
                            className="text-green-700 dark:text-green-300 font-mono text-lg md:text-xl font-bold hover:underline"
                          >
                            8827095122
                          </a>
                          <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                            Tap to call the seller
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading state */}
                  {isLoadingInquiry && isAuthenticated && (
                    <div className="bg-muted/50 border border-muted rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Loading your enquiries...</p>
                    </div>
                  )}

                  {/* Inquiry status display */}
                  {!isLoadingInquiry && userInquiry && (
                    <div className={`border-2 rounded-lg p-3 ${
                      userInquiry.status?.toLowerCase() === 'approved'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600'
                        : userInquiry.status?.toLowerCase() === 'pending' || userInquiry.status?.toLowerCase() === 'processing'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-sm font-bold">
                              {userInquiry.status?.toLowerCase() === 'approved'
                                ? '✅ Enquiry Approved!'
                                : userInquiry.status?.toLowerCase() === 'pending' || userInquiry.status?.toLowerCase() === 'processing'
                                ? '⏳ Sent - Awaiting Seller Approval'
                                : '❌ Enquiry ' + userInquiry.status
                              }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Enquiry ID: <span className="font-medium">{userInquiry.inquiryId}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Quantity: {userInquiry.quantity} {userInquiry.unit}
                            </p>
                          </div>

                          {/* Price breakdown */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Product Cost:</span>
                              <span className="font-semibold">₹{userInquiry.estimatedPrice?.toLocaleString('en-IN')}</span>
                            </div>

                            {/* Show shipping charges if seller has set them */}
                            {userInquiry.shippingCharge && userInquiry.shippingCharge > 0 && (
                              <>
                                <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300">
                                  <span>Shipping (seller set @ ₹{userInquiry.shippingRatePerKg}/kg):</span>
                                  <span className="font-semibold">₹{userInquiry.shippingCharge?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold pt-1 border-t">
                                  <span>Final Total:</span>
                                  <span className="text-green-700 dark:text-green-400">₹{userInquiry.finalTotal?.toLocaleString('en-IN')}</span>
                                </div>
                              </>
                            )}

                            {/* Show pending shipping message for approved without shipping */}
                            {userInquiry.status?.toLowerCase() === 'approved' && (!userInquiry.shippingCharge || userInquiry.shippingCharge === 0) && (
                              <p className="text-[10px] text-muted-foreground italic">
                                * Shipping charges will be added by seller
                              </p>
                            )}

                            {/* Show pending shipping message for non-approved */}
                            {userInquiry.status?.toLowerCase() !== 'approved' && (
                              <p className="text-[10px] text-muted-foreground italic">
                                * Excl. shipping (seller will set rate upon approval)
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={fetchUserInquiry}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          title="Refresh enquiry status"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* No inquiry message */}
                  {!isLoadingInquiry && !userInquiry && isAuthenticated && (
                    <div className="bg-muted/50 border border-muted rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Your enquiries appear here</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 md:gap-3">
                    {/* Quantity Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="h-10 w-10 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          min={1}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="h-10 w-10 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total: ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Buy Now Button */}
                    <Button
                      onClick={handleDirectBuyNow}
                      disabled={buyNowLoading}
                      className="w-full h-12 md:h-14 text-base md:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="h-6 w-6 mr-2" />
                      {buyNowLoading ? 'Processing...' : `Buy Now - ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                    </Button>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={loading}
                      variant="outline"
                      className="w-full h-10 md:h-11 text-sm md:text-base border-2 border-primary"
                      size="lg"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {loading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </div>

                  {!user?.hasSubscription && !showContactNumber && (
                    <p className="text-xs text-center text-muted-foreground">
                      Subscribe for ₹199/month to unlock all seller contacts
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="bg-secondary/30 py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-3 md:px-4">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-headline capitalize">
                  More from {product.category}
                </h2>
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="text-primary hover:underline text-xs md:text-sm font-semibold"
                >
                  View All
                </Link>
              </div>
              <CategoryProductCarousel products={relatedProducts} />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Subscription Paywall Modal */}
      <SubscriptionPaywall
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onSuccess={() => {
          setShowPaywall(false);
          setShowContactNumber(true);
        }}
      />

      {/* Inquiry Form Modal */}
      <InquiryFormModal
        open={showChatModal}
        onOpenChange={(open) => {
          setShowChatModal(open);
          // Refetch inquiry data when modal closes
          if (!open) {
            fetchUserInquiry();
          }
        }}
        product={product}
      />

      {/* Tutorial Modal */}
      <InquiryTutorialModal
        open={showTutorial}
        onOpenChange={(open) => {
          setShowTutorial(open);
          // When tutorial is closed, open the inquiry form
          if (!open) {
            setShowChatModal(true);
          }
        }}
      />

      {/* Chat Interface Modal */}
      {userInquiry && (
        <InquiryChatInterface
          open={showChatInterface}
          onOpenChange={(open) => {
            setShowChatInterface(open);
            // Refresh inquiry when chat closes
            if (!open) {
              fetchUserInquiry();
            }
          }}
          inquiryId={userInquiry.id}
        />
      )}

      {/* Payment Gateway Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Gateway</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete the purchase of ₹{(product.price * quantity).toLocaleString('en-IN')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {/* Mobile Number Input for Airpay */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                Mobile Number <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(Required for Airpay)</span>
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {mobileNumber.length === 10 ? '✓ Valid number' : `${mobileNumber.length}/10 digits`}
              </p>
            </div>

            {/* PayU */}
            <Button
              onClick={() => handlePaymentGatewaySelect('payu')}
              disabled={buyNowLoading}
              variant="outline"
              className="h-20 flex flex-col items-start justify-center border-2 hover:border-primary hover:bg-primary/5 text-foreground"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-foreground">PayU</p>
                  <p className="text-xs text-muted-foreground">Credit/Debit Card, UPI, Net Banking</p>
                </div>
                {buyNowLoading && selectedGateway === 'payu' && (
                  <span className="text-xs text-muted-foreground">Processing...</span>
                )}
              </div>
            </Button>

            {/* SabPaisa */}
            <Button
              onClick={() => handlePaymentGatewaySelect('sabpaisa')}
              disabled={buyNowLoading}
              variant="outline"
              className="h-20 flex flex-col items-start justify-center border-2 hover:border-primary hover:bg-primary/5 text-foreground"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-foreground">SabPaisa</p>
                  <p className="text-xs text-muted-foreground">All Payment Methods</p>
                </div>
                {buyNowLoading && selectedGateway === 'sabpaisa' && (
                  <span className="text-xs text-muted-foreground">Processing...</span>
                )}
              </div>
            </Button>

            {/* Airpay */}
            <Button
              onClick={() => handlePaymentGatewaySelect('airpay')}
              disabled={buyNowLoading}
              variant="outline"
              className="h-20 flex flex-col items-start justify-center border-2 hover:border-primary hover:bg-primary/5 text-foreground"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-base text-foreground">Airpay</p>
                  <p className="text-xs text-muted-foreground">UPI, Cards, Wallets</p>
                </div>
                {buyNowLoading && selectedGateway === 'airpay' && (
                  <span className="text-xs text-muted-foreground">Processing...</span>
                )}
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
