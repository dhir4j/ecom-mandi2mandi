'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { InquiryChatInterface } from '@/components/inquiry-chat-interface';
import { CheckCircle2, XCircle, Clock, MessageSquare, Package, MapPin, Calendar, Truck, IndianRupee } from 'lucide-react';
import { convertToKg } from '@/lib/shipping';

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
  status: string;
  createdOn: string;
  respondedOn?: string;
};

export function AdminInquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Track shipping rates for each inquiry (inquiryId -> rate)
  const [shippingRates, setShippingRates] = useState<Record<number, string>>({});
  const [approving, setApproving] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      // Admins can see all inquiries via a special endpoint
      // For now using seller-inquiries as a placeholder
      const response = await fetch('https://www.mandi.ramhotravels.com/api/inquiries/seller-inquiries', {
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

  const handleApprove = async (inquiryId: number) => {
    const rate = parseFloat(shippingRates[inquiryId] || '0');

    if (!rate || rate <= 0) {
      alert('Please enter a valid shipping rate per kg');
      return;
    }

    // Find the inquiry to calculate shipping
    const inquiry = inquiries.find(inq => inq.id === inquiryId);
    if (!inquiry) return;

    const weightInKg = convertToKg(inquiry.quantity, inquiry.unit);
    const shippingCharge = Math.round(weightInKg * rate);
    const finalTotal = inquiry.estimatedPrice + shippingCharge;

    setApproving({ ...approving, [inquiryId]: true });

    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/inquiries/${inquiryId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          shippingRatePerKg: rate,
          shippingCharge: shippingCharge,
          finalTotal: finalTotal,
        }),
      });

      if (response.ok) {
        // Clear the shipping rate for this inquiry
        const newRates = { ...shippingRates };
        delete newRates[inquiryId];
        setShippingRates(newRates);

        await fetchInquiries(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve inquiry');
      }
    } catch (error) {
      console.error('Failed to approve inquiry:', error);
      alert('Failed to approve inquiry. Please try again.');
    } finally {
      setApproving({ ...approving, [inquiryId]: false });
    }
  };

  const handleReject = async (inquiryId: number) => {
    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/inquiries/${inquiryId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchInquiries(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to reject inquiry:', error);
    }
  };

  const handleOpenChat = (inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setShowChat(true);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inquiry Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and respond to buyer inquiries
          </p>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Inquiries</h3>
              <p className="text-muted-foreground">
                No buyer inquiries have been received yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Side - Inquiry Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{inquiry.productName}</h3>
                            <p className="text-sm text-muted-foreground">{inquiry.inquiryId}</p>
                          </div>
                          {getStatusBadge(inquiry.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="flex items-start gap-2">
                            <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Quantity</p>
                              <p className="text-sm font-medium">
                                {inquiry.quantity} {inquiry.unit}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                ({convertToKg(inquiry.quantity, inquiry.unit).toFixed(2)} kg)
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground">Buyer</p>
                              <p className="text-sm font-medium">{inquiry.buyerName}</p>
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

                          <div className="bg-primary/10 p-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Est. Total</p>
                            <p className="font-bold text-primary">
                              ₹{inquiry.estimatedPrice.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Shipping Rate Input - Only for Pending */}
                        {inquiry.status === 'Pending' && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="h-4 w-4 text-blue-600" />
                              <Label htmlFor={`shipping-${inquiry.id}`} className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Shipping Rate (per kg) <span className="text-destructive">*</span>
                              </Label>
                            </div>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id={`shipping-${inquiry.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Enter rate (e.g., 2.50)"
                                value={shippingRates[inquiry.id] || ''}
                                onChange={(e) => setShippingRates({ ...shippingRates, [inquiry.id]: e.target.value })}
                                className="pl-9 h-9"
                              />
                            </div>
                            {shippingRates[inquiry.id] && parseFloat(shippingRates[inquiry.id]) > 0 && (
                              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                                <p>Shipping: ₹{(convertToKg(inquiry.quantity, inquiry.unit) * parseFloat(shippingRates[inquiry.id])).toFixed(2)}</p>
                                <p className="font-semibold">
                                  Final Total: ₹{(inquiry.estimatedPrice + (convertToKg(inquiry.quantity, inquiry.unit) * parseFloat(shippingRates[inquiry.id]))).toLocaleString('en-IN')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          onClick={() => handleOpenChat(inquiry.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none lg:w-full"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Button>

                        {inquiry.status === 'Pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(inquiry.id)}
                              variant="default"
                              size="sm"
                              className="flex-1 lg:flex-none lg:w-full"
                              disabled={!shippingRates[inquiry.id] || parseFloat(shippingRates[inquiry.id]) <= 0 || approving[inquiry.id]}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {approving[inquiry.id] ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => handleReject(inquiry.id)}
                              variant="destructive"
                              size="sm"
                              className="flex-1 lg:flex-none lg:w-full"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedInquiryId && (
        <InquiryChatInterface
          open={showChat}
          onOpenChange={setShowChat}
          inquiryId={selectedInquiryId}
        />
      )}
    </>
  );
}
