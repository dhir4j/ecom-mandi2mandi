'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { InquiryChatInterface } from '@/components/inquiry-chat-interface';
import Link from 'next/link';
import { MessageSquare, Package, MapPin, Calendar, CheckCircle2, XCircle, Clock, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InquiryTutorialModal, InquiryHelpButton } from '@/components/inquiry-tutorial-modal';

type Inquiry = {
  id: number;
  inquiryId: string;
  productId: string;
  productName: string;
  sellerId: number;
  sellerName: string;
  buyerId: number;
  buyerName: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  pricePerUnit: number;
  shippingRatePerKg?: number;
  shippingCharge?: number;
  finalTotal?: number;
  mobile?: string;
  status: string;
  createdOn: string;
  respondedOn?: string;
};

export default function MyInquiriesPage() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [notifiedInquiries, setNotifiedInquiries] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchInquiries();
    }
  }, [isAuthLoading, isAuthenticated]);

  // Show notifications for newly approved inquiries
  useEffect(() => {
    if (inquiries.length > 0) {
      inquiries.forEach((inquiry) => {
        if (inquiry.status === 'Approved' && !notifiedInquiries.has(inquiry.id)) {
          // Show toast notification
          toast({
            title: 'Inquiry Approved! 🎉',
            description: (
              <div className="flex flex-col gap-2">
                <p className="font-medium">{inquiry.productName}</p>
                <p className="text-sm">Your inquiry has been approved by the seller. You can now proceed to purchase!</p>
              </div>
            ),
            duration: 8000,
          });

          // Mark as notified
          setNotifiedInquiries((prev) => new Set(prev).add(inquiry.id));
        }
      });
    }
  }, [inquiries]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('https://www.mandi.ramhotravels.com/api/inquiries/my-inquiries', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = (inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setShowChat(true);
  };

  const handleProceedToBuy = async (inquiry: Inquiry) => {
    try {
      if (!user?.email) {
        alert('User email not found. Please login again.');
        return;
      }

      // Create PayU payment for this inquiry (use finalTotal if shipping added, otherwise estimatedPrice)
      const paymentAmount = inquiry.finalTotal || inquiry.estimatedPrice;
      const payuParams = {
        txnid: `INQ${inquiry.id}_${Date.now()}`,
        amount: paymentAmount.toFixed(2),
        productinfo: `${inquiry.productName} - ${inquiry.quantity} ${inquiry.unit}`,
        firstname: inquiry.buyerName,
        email: user.email,
        phone: inquiry.mobile || '0000000000',
        surl: 'https://www.mandi.ramhotravels.com/api/inquiry-payment-success',
        furl: 'https://www.mandi.ramhotravels.com/api/inquiry-payment-failure',
      };

      console.log('Initiating payment for inquiry:', payuParams);

      // Call backend to generate hash (include udf1 for inquiry ID)
      const response = await fetch('https://www.mandi.ramhotravels.com/api/get-payu-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...payuParams,
          udf1: inquiry.id.toString(), // Pass inquiry ID
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
        // Add inquiry ID as UDF field
        udf1: inquiry.id.toString(),
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      Approved: { variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
      Rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You must be logged in to view your inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-headline">My Inquiries</h1>
                <InquiryHelpButton onClick={() => setShowTutorial(true)} />
              </div>
              <p className="text-muted-foreground mt-1">
                View and manage your product inquiries
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>

          {/* Inquiries List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Inquiries Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't sent any product inquiries yet.
                </p>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {inquiries.map((inquiry) => (
                <Card
                  key={inquiry.id}
                  className={`hover:shadow-md transition-shadow ${
                    inquiry.status === 'Approved' ? 'border-green-500 border-2 bg-green-50/50 dark:bg-green-900/10' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left Side - Inquiry Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{inquiry.productName}</h3>
                            <p className="text-sm text-muted-foreground">{inquiry.inquiryId}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(inquiry.status)}
                            {inquiry.status === 'Approved' && (
                              <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                                <ShoppingCart className="w-3 h-3" />
                                Ready to Buy
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Quantity</p>
                              <p className="text-sm font-medium">
                                {inquiry.quantity} {inquiry.unit}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Seller</p>
                              <p className="text-sm font-medium">{inquiry.sellerName}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Sent On</p>
                              <p className="text-sm font-medium">
                                {new Date(inquiry.createdOn).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-muted/50 p-2 rounded-lg inline-block">
                            <p className="text-xs text-muted-foreground">Product Cost</p>
                            <p className="font-semibold text-sm">
                              ₹{inquiry.estimatedPrice.toLocaleString('en-IN')}
                            </p>
                          </div>

                          {/* Show shipping if seller has set it */}
                          {inquiry.shippingCharge && inquiry.shippingCharge > 0 && (
                            <div className="space-y-1">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 inline-block">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  Shipping (seller set @ ₹{inquiry.shippingRatePerKg}/kg)
                                </p>
                                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                                  ₹{inquiry.shippingCharge.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-2 rounded border-2 border-green-500 inline-block">
                                <p className="text-xs text-green-700 dark:text-green-300">Final Total</p>
                                <p className="font-bold text-lg text-green-900 dark:text-green-100">
                                  ₹{inquiry.finalTotal?.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button
                          onClick={() => handleOpenChat(inquiry.id)}
                          variant="outline"
                          className="flex-1 md:flex-none"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Button>

                        {inquiry.status === 'Approved' && (
                          <Button
                            onClick={() => handleProceedToBuy(inquiry)}
                            className="flex-1 md:flex-none"
                          >
                            Proceed to Buy
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Chat Interface */}
      {selectedInquiryId && (
        <InquiryChatInterface
          open={showChat}
          onOpenChange={setShowChat}
          inquiryId={selectedInquiryId}
        />
      )}

      {/* Tutorial Modal */}
      <InquiryTutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
    </div>
  );
}
