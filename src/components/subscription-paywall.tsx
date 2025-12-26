'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Lock, Phone, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type SubscriptionPaywallProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function SubscriptionPaywall({ open, onOpenChange, onSuccess }: SubscriptionPaywallProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'payu' | 'sabpaisa'>('payu');

  const handleSubscribe = async () => {
    console.log('Subscribe button clicked');
    console.log('User:', user);
    console.log('Selected gateway:', selectedGateway);

    if (!user) {
      console.error('No user found - user must be logged in');
      alert('Please log in to subscribe');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    console.log('Starting payment process...');

    try {
      // Common payment parameters
      const paymentParams = {
        txnid: `TXN${Date.now()}${user.id}`, // Unique transaction ID
        amount: '199.00',
        productinfo: 'Mandi2Mandi Premium Subscription - Monthly',
        firstname: user.name,
        email: user.email,
        phone: '0000000000', // Can be updated if user phone is stored
        gateway: selectedGateway, // Include selected gateway
      };

      // Set callback URLs based on gateway
      if (selectedGateway === 'sabpaisa') {
        paymentParams.surl = 'https://www.mandi.ramhotravels.com/api/sabpaisa-subscription-success';
        paymentParams.furl = 'https://www.mandi.ramhotravels.com/api/sabpaisa-subscription-failure';
      } else {
        paymentParams.surl = 'https://www.mandi.ramhotravels.com/api/subscription-success';
        paymentParams.furl = 'https://www.mandi.ramhotravels.com/api/subscription-failure';
      }

      console.log('Payment params:', paymentParams);

      // Call Flask backend to generate hash/encrypted data
      console.log('Calling Flask backend...');
      const response = await fetch('https://www.mandi.ramhotravels.com/api/get-payu-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will send session cookies to Flask backend
        body: JSON.stringify(paymentParams),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment initiate failed:', errorText);
        throw new Error(`Failed to initiate payment: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Payment initiate response:', data);

      // Create form and submit to payment gateway
      const form = document.createElement('form');
      form.method = 'POST';

      if (data.gateway === 'sabpaisa') {
        // SabPaisa payment flow
        const { sabpaisa_url, encData, clientCode } = data;

        if (!sabpaisa_url || !encData || !clientCode) {
          throw new Error('Missing required SabPaisa data from backend');
        }

        form.action = sabpaisa_url;

        // Add SabPaisa parameters as hidden inputs
        const sabpaisaParams = {
          encData,
          clientCode
        };

        Object.entries(sabpaisaParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
      } else {
        // PayU payment flow
        const { hash, payuUrl, merchantKey } = data;

        if (!hash || !payuUrl || !merchantKey) {
          throw new Error('Missing required PayU data from backend');
        }

        form.action = payuUrl;

        // Add PayU parameters as hidden inputs
        const payuParams = {
          key: merchantKey,
          txnid: paymentParams.txnid,
          amount: paymentParams.amount,
          productinfo: paymentParams.productinfo,
          firstname: paymentParams.firstname,
          email: paymentParams.email,
          phone: paymentParams.phone,
          surl: paymentParams.surl,
          furl: paymentParams.furl,
          hash
        };

        Object.entries(payuParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
      }

      document.body.appendChild(form);
      console.log(`Submitting form to ${selectedGateway}...`);
      form.submit();
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  const features = [
    'Unlimited access to seller contact details',
    'Direct phone numbers for all products',
    'Priority customer support',
    'No ads experience',
    'Cancel anytime',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Unlock Seller Contacts
          </DialogTitle>
          <DialogDescription className="text-center">
            Subscribe to access unlimited seller contact details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Pricing Card */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-baseline justify-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="text-4xl font-bold text-primary">₹199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                One-time monthly payment
              </p>
            </CardContent>
          </Card>

          {/* Features List */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">What you'll get:</p>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Payment Gateway Selection */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold">Choose Payment Gateway:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedGateway('payu')}
                disabled={isProcessing}
                className={`p-3 border-2 rounded-lg transition-all ${
                  selectedGateway === 'payu'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-base font-semibold">PayU</div>
                  <div className="text-xs text-muted-foreground">Trusted Gateway</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('sabpaisa')}
                disabled={isProcessing}
                className={`p-3 border-2 rounded-lg transition-all ${
                  selectedGateway === 'sabpaisa'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-base font-semibold">SabPaisa</div>
                  <div className="text-xs text-muted-foreground">Secure Solution</div>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Subscribe Now
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
              disabled={isProcessing}
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-center text-xs text-muted-foreground">
            🔒 Secure payment powered by {selectedGateway === 'payu' ? 'PayU' : 'SabPaisa'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
