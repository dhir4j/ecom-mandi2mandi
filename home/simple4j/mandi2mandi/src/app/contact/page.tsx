'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out all the fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Get In Touch</h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Have a question or need support? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Column */}
          <div className="space-y-8">
             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">For general inquiries, support, or feedback.</p>
                    <a href="mailto:info@mandi2mandi.com" className="text-primary font-semibold hover:underline mt-2 inline-block">
                      info@mandi2mandi.com
                    </a>
                  </div>
                </div>
            </Card>

             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">Our support team is available from 9am to 6pm IST.</p>
                    <a href="tel:8827095122" className="text-primary font-semibold hover:underline mt-2 inline-block">
                      8827095122
                    </a>
                  </div>
                </div>
            </Card>

             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Our Office</h3>
                    <address className="text-muted-foreground not-italic mt-1">
                      <strong>RKR MANTITOMANDI PRIVATE LIMITED</strong><br/>
                      Ground floor parag plaza fazalpura ujjain,<br/>
                      Madhya Pradesh – 456006,<br/>
                      India
                    </address>
                  </div>
                </div>
            </Card>
          </div>

          {/* Contact Form Column */}
          <Card className="p-6 md:p-8 shadow-lg border-t-4 border-primary">
             <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-headline">Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" value={formData.message} onChange={handleChange} required disabled={isSubmitting}/>
                    </div>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4"/>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
             </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
