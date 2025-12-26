import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Privacy Policy</CardTitle>
            <p className="text-muted-foreground pt-2">Last updated: July 26, 2025</p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>Welcome to Mandi2Mandi. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">1. Information We Collect</h2>
            <p>We may collect personal identification information (Name, email address, phone number, etc.) and non-personal identification information (browser name, type of computer, etc.).</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to operate and maintain our services, to process transactions, to send you notifications, and to improve our platform.</p>

            <h2 className="text-2xl font-semibold text-card-foreground pt-4">3. Sharing Your Information</h2>
            <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">4. Security of Your Information</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">5. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            
            <h2 className="text-2xl font-semibold text-card-foreground pt-4">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@mandi2mandi.com.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
