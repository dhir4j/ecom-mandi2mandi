'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf, Printer, AlertTriangle } from 'lucide-react';

type InvoiceDetails = {
  id: number;
  order_id_display: string;
  product_name: string;
  quantity: number;
  unit: string;
  total_price: number;
  amount_paid: number;
  payment_option: string;
  utr_code: string;
  status: string;
  buyer_name: string;
  buyer_mobile: string;
  ordered_on: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
};

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id) {
      const fetchInvoice = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://www.mandi.ramhotravels.com/api/orders/${id}`, {
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Failed to fetch invoice details.');
          }
          const data = await response.json();
          setInvoice(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [id, isAuthenticated, isAuthLoading, router]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || isAuthLoading) {
    return <InvoiceSkeleton />;
  }

  if (error) {
    return <InvoiceError message={error} />;
  }

  if (!invoice) {
    return <InvoiceError message="Invoice not found." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30 print:bg-white">
      <Header className="print:hidden"/>
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg print:shadow-none print:border-none">
          <CardHeader className="bg-muted/30 p-6 rounded-t-lg print:bg-transparent">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold font-headline">Mandi2Mandi</h1>
                </div>
                <CardTitle className="text-4xl font-headline">Invoice</CardTitle>
                <CardDescription>Order ID: {invoice.order_id_display}</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-semibold">Mandi2Mandi Inc.</p>
                <p className="text-sm text-muted-foreground">Ground floor parag plaza</p>
                <p className="text-sm text-muted-foreground">fazalpura ujjain, Madhya Pradesh</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2 text-lg text-muted-foreground">BILLED TO:</h3>
                <p className="font-bold text-lg">{invoice.buyer_name}</p>
                <address className="not-italic text-muted-foreground">
                  {invoice.address.line1}<br />
                  {invoice.address.line2 && <>{invoice.address.line2}<br /></>}
                  {invoice.address.city}, {invoice.address.state} - {invoice.address.pincode}<br />
                  {invoice.buyer_mobile}
                </address>
              </div>
              <div className="text-left md:text-right space-y-1">
                <p><span className="font-semibold">Invoice Date:</span> {new Date(invoice.ordered_on).toLocaleDateString()}</p>
                <p><span className="font-semibold">Order Status:</span> <span className="font-bold text-primary">{invoice.status}</span></p>
                <p><span className="font-semibold">Transaction ID:</span> {invoice.utr_code}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="border-b">
                    <th className="p-3 text-left font-semibold">Product</th>
                    <th className="p-3 text-right font-semibold">Quantity</th>
                    <th className="p-3 text-right font-semibold">Total Price</th>
                    <th className="p-3 text-right font-semibold">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">{invoice.product_name}</td>
                    <td className="p-3 text-right">{invoice.quantity} {invoice.unit}</td>
                    <td className="p-3 text-right">₹{invoice.total_price.toFixed(2)}</td>
                    <td className="p-3 text-right">₹{invoice.amount_paid.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="font-semibold">Subtotal</span>
                        <span>₹{invoice.total_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Taxes</span>
                        <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary border-t pt-2 mt-2">
                        <span>Total Paid</span>
                        <span>₹{invoice.amount_paid.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-muted-foreground text-sm">
                <p>Thank you for your business!</p>
                <p>If you have any questions about this invoice, please contact us at support@mandi2mandi.com</p>
            </div>
            
            <div className="mt-8 flex justify-center print:hidden">
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Download PDF
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>
      <Footer className="print:hidden"/>
    </div>
  );
}

function InvoiceSkeleton() {
    return (
     <div className="flex flex-col min-h-screen bg-secondary/30">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2"/>
                        <Skeleton className="h-12 w-32 mb-2"/>
                        <Skeleton className="h-4 w-40"/>
                    </div>
                    <div className="text-right space-y-2">
                        <Skeleton className="h-5 w-32 ml-auto"/>
                        <Skeleton className="h-4 w-48 ml-auto"/>
                        <Skeleton className="h-4 w-40 ml-auto"/>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                 <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-24 mb-2"/>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2 text-left md:text-right">
                         <Skeleton className="h-5 w-44 ml-auto mb-2"/>
                         <Skeleton className="h-5 w-48 ml-auto mb-2"/>
                         <Skeleton className="h-5 w-52 ml-auto"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="flex justify-end mt-6">
                    <div className="w-full max-w-xs space-y-3">
                        <Skeleton className="h-6 w-full"/>
                        <Skeleton className="h-6 w-full"/>
                        <Skeleton className="h-8 w-full mt-2"/>
                    </div>
                </div>
            </CardContent>
          </Card>
        </main>
        <Footer/>
    </div>
    )
}

function InvoiceError({ message }: { message: string }) {
    return (
         <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 rounded-full p-3 w-fit mb-4">
                            <AlertTriangle className="w-10 h-10 text-destructive"/>
                        </div>
                        <CardTitle>An Error Occurred</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}
