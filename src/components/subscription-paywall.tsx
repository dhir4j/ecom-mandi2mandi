'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [selectedGateway, setSelectedGateway] = useState<'payu' | 'sabpaisa' | 'airpay'>('payu');
  const [phoneNumber, setPhoneNumber] = useState('');

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

    // Validate phone number for Airpay
    if (selectedGateway === 'airpay') {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length !== 10) {
        alert('Please enter a valid 10-digit mobile number for Airpay payment');
        return;
      }
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
        phone: selectedGateway === 'airpay' ? phoneNumber.replace(/\D/g, '') : '0000000000',
        gateway: selectedGateway, // Include selected gateway
      };

      // Set callback URLs based on gateway
      if (selectedGateway === 'sabpaisa') {
        paymentParams.surl = 'https://www.mandi.ramhotravels.com/api/sabpaisa-subscription-success';
        paymentParams.furl = 'https://www.mandi.ramhotravels.com/api/sabpaisa-subscription-failure';
      } else if (selectedGateway === 'airpay') {
        paymentParams.surl = 'https://www.mandi.ramhotravels.com/api/airpay-subscription-success';
        paymentParams.furl = 'https://www.mandi.ramhotravels.com/api/airpay-subscription-failure';
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
      } else if (data.gateway === 'airpay') {
        // Airpay payment flow
        console.log('=== AIRPAY PAYMENT FLOW ===');
        console.log('Full backend response:', data);

        const { airpay_url, ...airpayParams } = data;

        if (!airpay_url) {
          throw new Error('Missing required Airpay URL from backend');
        }

        console.log('Airpay URL:', airpay_url);
        console.log('Airpay Params to send:', airpayParams);

        form.action = airpay_url;

        // Add Airpay parameters as hidden inputs (exclude gateway and airpay_url)
        // IMPORTANT: checksum MUST be added LAST (Airpay requirement)
        const formParams = {};
        const checksumValue = airpayParams.checksum;

        Object.entries(airpayParams).forEach(([key, value]) => {
          // Skip gateway, airpay_url, and checksum (checksum will be added last)
          if (key !== 'gateway' && key !== 'checksum' && value !== undefined && value !== null) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
            formParams[key] = String(value);
          }
        });

        // Add checksum as the LAST field
        if (checksumValue) {
          const checksumInput = document.createElement('input');
          checksumInput.type = 'hidden';
          checksumInput.name = 'checksum';
          checksumInput.value = String(checksumValue);
          form.appendChild(checksumInput);
          formParams['checksum'] = String(checksumValue);
        }

        console.log('Form params being submitted:', formParams);
        console.log('Form HTML:', form.innerHTML);
        console.log('⚠️ Note: checksum was added as LAST field (Airpay requirement)');
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
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedGateway('payu')}
                disabled={isProcessing}
                className={`p-2.5 border-2 rounded-lg transition-all ${
                  selectedGateway === 'payu'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-sm font-semibold">PayU</div>
                  <div className="text-[10px] text-muted-foreground">Trusted</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('sabpaisa')}
                disabled={isProcessing}
                className={`p-2.5 border-2 rounded-lg transition-all ${
                  selectedGateway === 'sabpaisa'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-sm font-semibold">SabPaisa</div>
                  <div className="text-[10px] text-muted-foreground">Secure</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('airpay')}
                disabled={isProcessing}
                className={`p-2.5 border-2 rounded-lg transition-all ${
                  selectedGateway === 'airpay'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-sm font-semibold">Airpay</div>
                  <div className="text-[10px] text-muted-foreground">Fast</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Number Input - Only for Airpay */}
          {selectedGateway === 'airpay' && (
            <div className="space-y-2 pt-2">
              <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile Number (Required for Airpay)
              </label>
              <Input
                type="tel"
                id="phone"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(value);
                }}
                maxLength={10}
                disabled={isProcessing}
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Your mobile number is required for Airpay payment processing
              </p>
            </div>
          )}

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
            🔒 Secure payment powered by {selectedGateway === 'payu' ? 'PayU' : selectedGateway === 'sabpaisa' ? 'SabPaisa' : 'Airpay'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
