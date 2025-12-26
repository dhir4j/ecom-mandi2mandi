'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  CheckCircle,
  CreditCard,
  Package,
  ThumbsUp,
  Shield,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

type TutorialStep = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
};

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Send Your Inquiry',
    description: 'Start by submitting an inquiry for the product you want to purchase.',
    icon: FileText,
    details: [
      'Fill out the inquiry form with your required quantity',
      'Provide your delivery address and contact details',
      'Review the estimated price based on your quantity',
      'Submit your inquiry to the seller',
    ],
  },
  {
    title: 'Seller Reviews & Approves',
    description: 'The seller will review your inquiry and decide whether to approve it.',
    icon: CheckCircle,
    details: [
      'Seller receives notification of your inquiry',
      'They can chat with you to discuss details',
      'Seller verifies product availability and delivery feasibility',
      'You\'ll be notified once your inquiry is approved',
    ],
  },
  {
    title: 'Secure Escrow Payment',
    description: 'Make a secure payment through our escrow system for buyer protection.',
    icon: Shield,
    details: [
      'Once approved, you can proceed to payment',
      'We act as an escrow - your payment is held securely',
      'Seller DOES NOT receive the money immediately',
      'Your funds are protected until you confirm delivery',
    ],
  },
  {
    title: 'Payment & Platform Protection',
    description: 'Your payment is processed through PayU gateway and held by Mandi2Mandi.',
    icon: CreditCard,
    details: [
      'Pay via UPI, Credit/Debit Card, or Net Banking',
      'Payment is processed securely through PayU',
      'Mandi2Mandi holds your payment in escrow',
      'Seller gets confirmation to ship the product',
    ],
  },
  {
    title: 'Seller Ships Product',
    description: 'Seller handles the delivery through courier services like Delhivery, Blue Dart, etc.',
    icon: Package,
    details: [
      'Seller receives order confirmation after your payment',
      'Product is packaged and handed to courier service',
      'Delivery is done through 3rd party services (Delhivery, Blue Dart, etc.)',
      'Seller updates delivery status and tracking information',
      'You can track your shipment until delivery',
    ],
  },
  {
    title: 'Confirm & Release Payment',
    description: 'After receiving the product, confirm delivery to release payment to seller.',
    icon: ThumbsUp,
    details: [
      'Receive and inspect your product',
      'Confirm delivery on the platform',
      'Mandi2Mandi releases payment to the seller',
      'Transaction complete - both parties protected!',
    ],
  },
];

type InquiryTutorialModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InquiryTutorialModal({ open, onOpenChange }: InquiryTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6 text-primary" />
            How Inquiry & Buying Works
          </DialogTitle>
          <DialogDescription>
            Learn about our secure escrow-based buying process
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {tutorialSteps.map((s, index) => {
              const StepIcon = s.icon;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  {index < tutorialSteps.length - 1 && (
                    <div
                      className={`h-1 w-full mt-5 ${
                        index < currentStep ? 'bg-green-500' : 'bg-muted'
                      }`}
                      style={{ position: 'absolute', left: '50%', width: `calc(100% / ${tutorialSteps.length})` }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Content */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <Badge variant="outline">
                      Step {currentStep + 1} of {tutorialSteps.length}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {step.details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <p className="text-sm flex-1">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Escrow Highlight */}
              {currentStep === 2 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        Protected by Escrow
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Mandi2Mandi acts as a trusted intermediary. Your money is safe with us until you receive and confirm your order!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button
                onClick={() => {
                  handleReset();
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                Got It!
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Jump */}
          <div className="flex items-center justify-center gap-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-muted'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Help Button Component for easy integration
type HelpButtonProps = {
  onClick: () => void;
  className?: string;
};

export function InquiryHelpButton({ onClick, className = '' }: HelpButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`rounded-full ${className}`}
      title="Learn how inquiry and buying works"
    >
      <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
    </Button>
  );
}
