
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Target, Handshake, Zap, Eye, Scale } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-primary/10 rounded-full p-4 w-fit">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline">About Mandi2Mandi</CardTitle>
            <p className="text-lg text-muted-foreground pt-2">A venture of RKR MANTITOMANDI PRIVATE LIMITED</p>
          </CardHeader>
          <CardContent className="text-lg text-muted-foreground space-y-12 px-4 md:px-8">
            <p className="text-center">Mandi2Mandi is India's premier digital agricultural marketplace, connecting traders and buyers directly. We've revolutionized how agricultural products are traded by creating a transparent, efficient, and technology-driven platform that empowers businesses to grow and thrive in the modern agricultural economy.</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-accent flex-shrink-0"/>
                <h3 className="text-2xl font-semibold text-card-foreground font-headline">Our Mission</h3>
              </div>
              <p>To democratize agricultural trade by providing a digital platform that connects traders directly with buyers across India. We enable traders to showcase their quality produce to a nationwide audience while helping buyers discover the best agricultural products at competitive prices. Our mission is to eliminate traditional barriers in agricultural commerce and create a transparent, efficient marketplace powered by technology.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Handshake className="w-8 h-8 text-accent flex-shrink-0"/>
                <h3 className="text-2xl font-semibold text-card-foreground font-headline">Our Vision</h3>
              </div>
              <p>We envision becoming India's largest digital agricultural marketplace, where every trader has equal opportunity to reach buyers nationwide, and every buyer can access quality agricultural products with complete transparency. By leveraging cutting-edge technology, we aim to transform agricultural trade, making it more accessible, efficient, and profitable for all participants in the ecosystem.</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-card-foreground text-center mb-6 font-headline">Our Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-lg">
                  <Eye className="w-10 h-10 text-primary mb-4"/>
                  <h4 className="text-xl font-semibold text-card-foreground mb-2">Transparency</h4>
                  <p className="text-base">Clear pricing and open communication at every step.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-lg">
                  <Scale className="w-10 h-10 text-primary mb-4"/>
                  <h4 className="text-xl font-semibold text-card-foreground mb-2">Fairness</h4>
                  <p className="text-base">Ensuring equitable opportunities and prices for all participants.</p>
                </div>
                 <div className="flex flex-col items-center p-6 bg-secondary/30 rounded-lg">
                  <Zap className="w-10 h-10 text-primary mb-4"/>
                  <h4 className="text-xl font-semibold text-card-foreground mb-2">Empowerment</h4>
                  <p className="text-base">Providing tools and access to help our users grow and succeed.</p>
                </div>
              </div>
            </div>

            <p className="text-center border-t pt-8 mt-8 border-dashed">By leveraging technology, we are not just creating a marketplace; we are building a trusted community. Join us in transforming the agricultural landscape of India, one transaction at a time.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
