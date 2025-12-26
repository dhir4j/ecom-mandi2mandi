'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Send, Package, MapPin, CheckCircle2, XCircle, Clock, MessageSquare, ShoppingCart, AlertTriangle, Shield } from 'lucide-react';
import { detectContactInfo, getContactWarningMessage } from '@/lib/contact-detection';

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
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  mobile: string;
  additionalNotes?: string;
  status: string;
  createdOn: string;
  respondedOn?: string;
};

type ChatMessage = {
  id: number;
  inquiryId: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  message: string;
  createdOn: string;
  isRead: boolean;
};

type InquiryChatInterfaceProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiryId: number;
};

export function InquiryChatInterface({ open, onOpenChange, inquiryId }: InquiryChatInterfaceProps) {
  const { user } = useAuth();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [contactWarning, setContactWarning] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inquiryId) {
      fetchInquiryDetails();
      fetchMessages();
    }
  }, [open, inquiryId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const fetchInquiryDetails = async () => {
    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/inquiries/${inquiryId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInquiry(data.inquiry);
      }
    } catch (error) {
      console.error('Failed to fetch inquiry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/inquiries/${inquiryId}/messages`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    // Check for contact information
    const contactCheck = detectContactInfo(newMessage);

    if (contactCheck.hasContact) {
      const warningMsg = getContactWarningMessage(contactCheck.types);
      setContactWarning(warningMsg);

      // Block sending if severity is high (phone numbers or emails)
      if (contactCheck.severity === 'high') {
        // Don't send the message, just show the warning
        setTimeout(() => setContactWarning(''), 8000); // Clear warning after 8 seconds
        return;
      }

      // For medium severity, allow but warn
      setTimeout(() => setContactWarning(''), 6000);
    }

    setIsSending(true);

    try {
      const response = await fetch(`https://www.mandi.ramhotravels.com/api/inquiries/${inquiryId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setContactWarning(''); // Clear any warnings on successful send
        await fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProceedToBuy = async () => {
    if (!inquiry || !user?.email) {
      alert('Unable to proceed. Please try again.');
      return;
    }

    try {
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

      // Call backend to generate hash
      const response = await fetch('https://www.mandi.ramhotravels.com/api/get-payu-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...payuParams,
          udf1: inquiry.id.toString(),
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

  if (isLoading || !inquiry) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <div className="flex items-center justify-center py-8">
            <p>Loading inquiry details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[95vh] sm:h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl truncate">Inquiry Chat</DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                {inquiry.inquiryId} • {inquiry.productName}
              </p>
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(inquiry.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-1 overflow-hidden">
          {/* Left Side - Inquiry Details */}
          <div className="hidden md:block md:col-span-1 border-r bg-muted/30 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inquiry Details
            </h3>

            <div className="space-y-4">
              {/* Product Info */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="font-semibold text-sm">{inquiry.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seller</p>
                    <p className="font-medium text-sm">{inquiry.sellerName}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quantity & Price */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="font-semibold text-sm">
                      {inquiry.quantity} {inquiry.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price per {inquiry.unit}</p>
                    <p className="font-medium text-sm">
                      ₹{inquiry.pricePerUnit.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Separator />

                  {/* Show price breakdown */}
                  <div className="space-y-2">
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Product Cost</p>
                      <p className="font-semibold text-sm">
                        ₹{inquiry.estimatedPrice.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Show shipping if seller has set it */}
                    {inquiry.shippingCharge && inquiry.shippingCharge > 0 && (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            Shipping (seller set @ ₹{inquiry.shippingRatePerKg}/kg)
                          </p>
                          <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                            ₹{inquiry.shippingCharge.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-2 rounded border-2 border-green-500">
                          <p className="text-xs text-green-700 dark:text-green-300">Final Total</p>
                          <p className="font-bold text-lg text-green-900 dark:text-green-100">
                            ₹{inquiry.finalTotal?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Show message if no shipping yet */}
                    {inquiry.status?.toLowerCase() === 'approved' && (!inquiry.shippingCharge || inquiry.shippingCharge === 0) && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200">
                        <p className="text-[10px] text-yellow-700 dark:text-yellow-300">
                          * Shipping charges will be added by seller
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                  </div>
                  <p className="text-sm">{inquiry.address.line1}</p>
                  {inquiry.address.line2 && <p className="text-sm">{inquiry.address.line2}</p>}
                  <p className="text-sm">
                    {inquiry.address.city}, {inquiry.address.state} - {inquiry.address.pincode}
                  </p>
                  <p className="text-sm font-medium">Mobile: {inquiry.mobile}</p>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              {inquiry.additionalNotes && (
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">Additional Notes</p>
                    <p className="text-sm">{inquiry.additionalNotes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Created Date */}
              <div className="text-xs text-muted-foreground">
                Created: {new Date(inquiry.createdOn).toLocaleString('en-IN')}
              </div>

              {/* Direct Buy Button - Only show if inquiry is approved */}
              {inquiry.status?.toLowerCase() === 'approved' && (
                <Button
                  onClick={handleProceedToBuy}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Proceed to Buy Now
                </Button>
              )}
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="md:col-span-2 flex flex-col flex-1">
            {/* Mobile Inquiry Summary */}
            <div className="md:hidden bg-muted/30 p-3 border-b">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{inquiry.quantity} {inquiry.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary whitespace-nowrap block">
                    ₹{(inquiry.finalTotal || inquiry.estimatedPrice).toLocaleString('en-IN')}
                  </span>
                  {inquiry.shippingCharge && inquiry.shippingCharge > 0 && (
                    <span className="text-[10px] text-muted-foreground">incl. shipping</span>
                  )}
                </div>
              </div>
              {inquiry.status?.toLowerCase() === 'approved' && (
                <Button
                  onClick={handleProceedToBuy}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-sm text-sm h-9"
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Proceed to Buy
                </Button>
              )}
            </div>

            {/* Chat Header */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <p className="font-semibold text-sm truncate">
                  Chat with {user?.id === inquiry.sellerId ? inquiry.buyerName : inquiry.sellerName}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground px-4">
                  <p className="text-sm text-center">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 sm:px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-xs font-semibold">{message.senderName}</p>
                            <Badge variant="outline" className="text-[10px] sm:text-xs py-0 px-1">
                              {message.senderRole}
                            </Badge>
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                          <p className="text-[10px] sm:text-xs opacity-70 mt-1">
                            {new Date(message.createdOn).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Contact Warning Banner */}
            {contactWarning && (
              <div className="px-3 sm:px-4 pt-3">
                <Alert variant="destructive" className="border-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    {contactWarning}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Premium Membership Banner */}
            {!contactWarning && (
              <div className="px-3 sm:px-4 pt-2">
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-[10px] sm:text-xs text-blue-900 dark:text-blue-100">
                    <strong>Premium members</strong> get verified seller contact details. Subscribe to unlock direct communication. Chat is monitored for security.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="text-sm sm:text-base"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
