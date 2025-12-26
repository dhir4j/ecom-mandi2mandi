'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const status = searchParams.get('status');
  const txnid = searchParams.get('txnid');
  const message = searchParams.get('message');

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful!',
          description: 'Your order has been placed successfully.',
          message: `Transaction ID: ${txnid || 'N/A'}`,
          buttonText: 'View My Orders',
          buttonAction: () => router.push('/my-orders')
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          description: 'Your payment could not be processed.',
          message: message || 'Please try again or contact support.',
          buttonText: 'Try Again',
          buttonAction: () => router.push('/')
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
          title: 'Payment Status Unknown',
          description: 'We could not verify your payment status.',
          message: message || 'Please contact support with your transaction ID.',
          buttonText: 'Go to Home',
          buttonAction: () => router.push('/')
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {config.icon}
            </div>
            <CardTitle className="text-2xl font-headline">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">{config.message}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={config.buttonAction} className="w-full">
                {config.buttonText}
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
