'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Send, CheckCircle2, MessageSquare, Info } from 'lucide-react';
import type { Product } from '@/lib/types';
import { InquiryChatInterface } from '@/components/inquiry-chat-interface';
import { InquiryTutorialModal, InquiryHelpButton } from '@/components/inquiry-tutorial-modal';

type InquiryFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
};

export function InquiryFormModal({ open, onOpenChange, product }: InquiryFormModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const [formData, setFormData] = useState({
    quantity: '',
    unit: product.unit || 'Kg',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate product total (shipping will be added by seller later)
  const productTotal = formData.quantity && parseFloat(formData.quantity) > 0
    ? parseFloat(formData.quantity) * product.price
    : 0;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        productId: product.id,
        productName: product.title,
        sellerId: product.seller_id || 1, // Default to 1 if not available (for JSON products)
        sellerName: product.seller,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        estimatedPrice: productTotal, // Product price only (shipping to be added by seller)
        pricePerUnit: product.price,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        mobile: formData.mobile,
        additionalNotes: formData.additionalNotes,
      };

      console.log('Submitting inquiry:', payload);

      const response = await fetch('https://www.mandi.ramhotravels.com/api/inquiries/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Failed to submit inquiry: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Inquiry submitted successfully:', data);

      // Save the inquiry ID for opening chat
      if (data.inquiry && data.inquiry.id) {
        setSubmittedInquiryId(data.inquiry.id);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <>
        <Dialog open={open} onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) {
            // Reset success state when closing
            setTimeout(() => {
              setIsSuccess(false);
              setSubmittedInquiryId(null);
            }, 300);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="mb-4 bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Inquiry Sent Successfully!</h3>
              <p className="text-muted-foreground px-4">
                Your inquiry has been sent to the seller. You will be notified once the seller approves your request.
              </p>
              <p className="text-sm text-muted-foreground px-4">
                You can chat with the seller to discuss product details, pricing, and delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full px-4">
                <Button
                  onClick={() => {
                    setShowChat(true);
                    onOpenChange(false);
                  }}
                  disabled={!submittedInquiryId}
                  className="flex-1"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  size="lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Chat Interface */}
        {submittedInquiryId && (
          <InquiryChatInterface
            open={showChat}
            onOpenChange={setShowChat}
            inquiryId={submittedInquiryId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">Send Inquiry</DialogTitle>
                <DialogDescription>
                  Fill in the details below to send your inquiry to the seller
                </DialogDescription>
              </div>
              <InquiryHelpButton onClick={() => setShowTutorial(true)} />
            </div>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Product Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold text-lg">{product.title}</p>
            <p className="text-sm text-muted-foreground">
              Seller: {product.seller} | Location: {product.location}
            </p>
            <p className="text-sm font-semibold mt-1">
              Price: ₹{product.price.toLocaleString('en-IN')}/{product.unit}
            </p>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity Required <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className={errors.quantity ? 'border-destructive' : ''}
              />
              <Input
                value={formData.unit}
                readOnly
                className="w-24 bg-muted cursor-not-allowed"
                placeholder="Unit"
              />
            </div>
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity}</p>
            )}
          </div>

          {/* Product Price (Without Shipping) */}
          {formData.quantity && (
            <div className="space-y-3">
              {/* Product Total */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-base font-semibold">Product Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{productTotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.quantity} {formData.unit} × ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  (Shipping charges excluded)
                </p>
              </div>

              {/* Shipping Info */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <p className="font-medium mb-1">💰 About Shipping Charges:</p>
                  <p>The seller will add shipping charges based on your delivery location and quantity. You can discuss shipping costs via chat before finalizing the order.</p>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="font-semibold">Delivery Address</h3>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressLine1"
                placeholder="House/Flat No., Building Name"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className={errors.addressLine1 ? 'border-destructive' : ''}
              />
              {errors.addressLine1 && (
                <p className="text-sm text-destructive">{errors.addressLine1}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                placeholder="Street, Area, Landmark"
                value={formData.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={errors.state ? 'border-destructive' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">
                Pincode <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pincode"
                placeholder="6-digit pincode"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                maxLength={6}
                className={errors.pincode ? 'border-destructive' : ''}
              />
              {errors.pincode && (
                <p className="text-sm text-destructive">{errors.pincode}</p>
              )}
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="mobile">
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              maxLength={10}
              className={errors.mobile ? 'border-destructive' : ''}
            />
            {errors.mobile && (
              <p className="text-sm text-destructive">{errors.mobile}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or questions for the seller..."
              value={formData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

      {/* Tutorial Modal */}
      <InquiryTutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
    </>
  );
}
