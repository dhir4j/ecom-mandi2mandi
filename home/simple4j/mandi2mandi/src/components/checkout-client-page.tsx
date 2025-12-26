'use client';

import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ArrowLeft, IndianRupee, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

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
      state
    };

    try {
      const response = await fetch('https://www.mandi.ramhotravels.com/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.key) {
        toast({
          title: "Redirecting to Payment Gateway...",
          description: "Please wait while we securely redirect you.",
        });
        
        const form = paymentFormRef.current;
        if (form) {
          form.innerHTML = '';
          form.action = result.payu_url;
          form.method = 'POST';
          
          Object.keys(result).forEach(param => {
            if (result[param] !== null && param !== 'payu_url') {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = param;
              input.value = String(result[param]);
              form.appendChild(input);
            }
          });
          
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
                <p className="mb-4 text-lg">Invalid order details or product not found.</p>
                <Button onClick={() => router.push('/')}>Go to Home</Button>
            </div>
        </main>
      </div>
    );
  }

  const fullAddress = [addressLine1, addressLine2, city, state, pincode].filter(Boolean).join(', ');

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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image 
                  src={product.images[0]} 
                  alt={product.title} 
                  width={80} height={80} 
                  className="rounded-md" 
                  data-ai-hint={product.aiHint}
                  unoptimized
                />
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-muted-foreground">{product.location}</p>
                </div>
              </div>
              <div className="border-t border-dashed my-4"></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Deliver to:</span>
                    <span className="text-right font-medium">{buyerName}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Address:</span>
                    <span className="text-right">{fullAddress}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Contact:</span>
                    <span className="text-right">{mobile}</span>
                </div>
              </div>
              <div className="border-t border-dashed my-4"></div>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Quantity:</span> <span>{quantity} {unit}</span></div>
                <div className="flex justify-between text-lg font-bold text-primary mt-2 pt-2 border-t">
                  <span className="font-headline">Total Amount</span>
                  <span className="flex items-center"><IndianRupee size={18} className="mr-1"/>{parseFloat(amountToPay as string).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-secondary/30">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Complete Payment</CardTitle>
              <CardDescription>Finalize your order through our secure payment gateway.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center gap-4">
                <AnimatedPaymentIcon />
                <p className="text-muted-foreground max-w-sm">
                    You will be redirected to our trusted partner to complete your payment securely.
                </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProceedToPayment} className="w-full bg-primary hover:bg-primary/90" disabled={isProcessing}>
                <ShieldCheck className="mr-2 h-4 w-4"/>
                {isProcessing ? 'Initiating Payment...' : `Pay ₹${parseFloat(amountToPay as string).toFixed(2)} securely`}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <form ref={paymentFormRef} style={{ display: 'none' }} noValidate></form>
      </main>
    </div>
  );
}