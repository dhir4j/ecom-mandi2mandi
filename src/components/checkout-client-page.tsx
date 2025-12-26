// src/components/checkout-client-page.tsx
'use client';

import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ArrowLeft, IndianRupee, ShieldCheck, Package } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const AnimatedPaymentIcon = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="75" cy="75" r="60" stroke="hsl(var(--primary))" strokeWidth="4" strokeOpacity="0.2"/>
    <path d="M45 75C45 58.4315 58.4315 45 75 45" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="1s" repeatCount="indefinite" />
    </path>
    <path d="M60 75L70 85L90 65" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0">
       <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

type CheckoutClientPageProps = {
  product: Product | null;
  searchParams: { [key: string]: string | undefined };
};

export function CheckoutClientPage({ product, searchParams }: CheckoutClientPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'payu' | 'sabpaisa' | 'airpay'>('payu');
  const paymentFormRef = useRef<HTMLFormElement>(null);

  const {
    quantity, unit, totalPrice, amountToPay, paymentOption,
    buyerName, mobile, pincode, addressLine1, addressLine2, city, state
  } = searchParams;

  const handleProceedToPayment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    const orderData = {
      amount: parseFloat(amountToPay as string),
      productName: product!.title,
      productId: product!.id,
      category: product!.category,
      subcategory: product!.subcategory,
      seller: product!.seller,
      quantity,
      unit,
      totalPrice,
      paymentOption,
      buyerName,
      mobile,
      pincode,
      addressLine1,
      addressLine2,
      city,
      state,
      gateway: selectedGateway, // Include selected gateway
    };

    try {
      const response = await fetch('https://www.mandi.ramhotravels.com/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Redirecting to Payment Gateway...",
          description: "Please wait while we securely redirect you.",
        });

        const form = paymentFormRef.current;
        if (form) {
          form.innerHTML = '';
          form.method = 'POST';

          if (result.gateway === 'sabpaisa') {
            // Handle SabPaisa redirection
            form.action = result.sabpaisa_url;

            // Add SabPaisa required fields
            const encDataInput = document.createElement('input');
            encDataInput.type = 'hidden';
            encDataInput.name = 'encData';
            encDataInput.value = result.encData;
            form.appendChild(encDataInput);

            const clientCodeInput = document.createElement('input');
            clientCodeInput.type = 'hidden';
            clientCodeInput.name = 'clientCode';
            clientCodeInput.value = result.clientCode;
            form.appendChild(clientCodeInput);
          } else if (result.gateway === 'airpay') {
            // Handle Airpay redirection
            form.action = result.airpay_url;

            Object.keys(result).forEach(param => {
              if (result[param] !== null && param !== 'airpay_url' && param !== 'gateway') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = param;
                input.value = String(result[param]);
                form.appendChild(input);
              }
            });
          } else {
            // Handle PayU redirection
            form.action = result.payu_url;

            Object.keys(result).forEach(param => {
              if (result[param] !== null && param !== 'payu_url' && param !== 'gateway') {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = param;
                input.value = String(result[param]);
                form.appendChild(input);
              }
            });
          }

          setTimeout(() => {
            form.submit();
          }, 100);
        }
      } else {
        throw new Error(result.error || 'Failed to initiate payment.');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Could not connect to the payment gateway. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };
  
  if (!product || !quantity || !totalPrice || !amountToPay) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-4">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-4 text-lg">Invalid order details or product not found.</p>
            <Button onClick={() => router.push('/')}>Go to Home</Button>
          </div>
        </main>
      </div>
    );
  }

  const fullAddress = [addressLine1, addressLine2, city, state, pincode].filter(Boolean).join(', ');
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
  const productImage = product.images[0] || PLACEHOLDER_IMAGE;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/order/${product.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Link>
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Order Summary Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              <CardDescription>Review your order details before payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Info */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={productImage}
                    alt={product.title}
                    fill
                    className="rounded-md object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.subcategory}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{product.location}</p>
                  <p className="text-sm text-muted-foreground">Seller: {product.seller}</p>
                </div>
              </div>

              <div className="border-t border-dashed my-4"></div>

              {/* Delivery Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Deliver to:</span>
                  <span className="text-right font-medium">{buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Address:</span>
                  <span className="text-right max-w-[60%]">{fullAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Contact:</span>
                  <span className="text-right">{mobile}</span>
                </div>
              </div>

              <div className="border-t border-dashed my-4"></div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per {unit}:</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>{quantity} {unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{parseFloat(totalPrice as string).toLocaleString('en-IN')}</span>
                </div>
                {paymentOption === 'partial' && (
                  <>
                    <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                      <span>Advance Payment (30%):</span>
                      <span>₹{parseFloat(amountToPay as string).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Pay on Delivery (70%):</span>
                      <span>₹{(parseFloat(totalPrice as string) - parseFloat(amountToPay as string)).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-2 mt-2"></div>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span className="font-headline">Amount to Pay Now</span>
                  <span className="flex items-center">
                    <IndianRupee size={18} className="mr-1"/>
                    {parseFloat(amountToPay as string).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="shadow-lg bg-secondary/30">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Complete Payment</CardTitle>
              <CardDescription>Choose your payment gateway and finalize your order.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Payment Gateway Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('payu')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedGateway === 'payu'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-lg font-semibold">PayU</div>
                      <div className="text-xs text-muted-foreground">Trusted Gateway</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('sabpaisa')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedGateway === 'sabpaisa'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-lg font-semibold">SabPaisa</div>
                      <div className="text-xs text-muted-foreground">Secure Solution</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGateway('airpay')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedGateway === 'airpay'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-lg font-semibold">Airpay</div>
                      <div className="text-xs text-muted-foreground">Fast & Reliable</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Animation and Info */}
              <div className="flex flex-col items-center text-center gap-4 pt-4 border-t">
                <AnimatedPaymentIcon />
                <p className="text-muted-foreground max-w-sm">
                  You will be redirected to <span className="font-semibold">
                    {selectedGateway === 'payu' ? 'PayU' : selectedGateway === 'sabpaisa' ? 'SabPaisa' : 'Airpay'}
                  </span> to complete your transaction securely.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProceedToPayment} 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isProcessing}
                size="lg"
              >
                <ShieldCheck className="mr-2 h-5 w-5"/>
                {isProcessing 
                  ? 'Initiating Payment...' 
                  : `Pay ₹${parseFloat(amountToPay as string).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Securely`
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Hidden payment form */}
        <form ref={paymentFormRef} style={{ display: 'none' }} noValidate></form>
      </main>
    </div>
  );
}