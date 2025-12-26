import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Refund Policy</CardTitle>
            <p className="text-muted-foreground pt-2">Last updated: July 26, 2025</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>Thank you for shopping at Mandi2Mandi. We are committed to ensuring the satisfaction of our buyers.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">1. General Policy</h2>
            <p>Due to the perishable nature of our products, we do not offer returns or refunds on purchased items. All sales are final.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">2. Damaged or Incorrect Products</h2>
            <p>If you receive a damaged product or an incorrect order, please contact our customer support within 24 hours of delivery with photographic evidence. We will review the case and, at our discretion, may offer a replacement or a credit to your account.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">3. Cancellation</h2>
            <p>Once an order is placed and payment is confirmed, it cannot be canceled.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">4. Advance Payments</h2>
            <p>Advance payments made for orders are non-refundable, except in cases where Mandi2Mandi is unable to fulfill the order.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">5. Contact Us</h2>
            <p>If you have any questions about our Refund Policy, please contact us at support@mandi2mandi.com.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
