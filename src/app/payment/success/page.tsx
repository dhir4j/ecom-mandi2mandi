'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Refresh user data to get updated subscription status
    window.location.reload();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your subscription has been activated successfully.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold">Subscription Details:</p>
              <div className="text-left space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">Premium Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">₹199.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-left text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Seller Contact Number:
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 font-mono text-lg mt-1">
                    8827095122
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                    Use this number to contact sellers for all products
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
