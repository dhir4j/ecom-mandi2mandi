import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Terms of Service</CardTitle>
            <p className="text-muted-foreground pt-2">Last updated: July 26, 2025</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>Please read these Terms of Service carefully before using the Mandi2Mandi website and services.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">1. Agreement to Terms</h2>
            <p>By using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Services.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">2. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">3. Content</h2>
            <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">4. Prohibited Uses</h2>
            <p>You may use the Service only for lawful purposes and in accordance with the Terms. You agree not to use the Service in any way that violates any applicable national or international law or regulation.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">5. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">6. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@mandi2mandi.com.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
