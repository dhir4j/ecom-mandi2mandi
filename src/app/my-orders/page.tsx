'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Package, ShoppingCart, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type Order = {
  id: number;
  order_id_display: string;
  date: string;
  product_name: string;
  total: string;
  status: string;
};

export default function MyOrdersPage() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      return; 
    }
    if (isAuthenticated) {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('https://www.mandi.ramhotravels.com/api/my-orders', {
            credentials: 'include',
          });
          if (!response.ok) {
            if (response.status === 401) {
              setError("Please log in to view your orders.");
            } else {
              throw new Error('Failed to fetch orders');
            }
            return;
          }
          const data = await response.json();
          setOrders(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading]);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'booked':
        return 'default';
      case 'cancelled':
      case 'failed':
        return 'destructive';
      case 'shipped':
      case 'in transit':
        return 'outline';
      default:
        return 'secondary';
    }
  };


  if (isAuthLoading) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You must be logged in to view your orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-headline">My Orders</CardTitle>
                <CardDescription>Here is a list of your past and current orders, {user?.name}.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="space-y-4 p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">
                <p>Error: {error}</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_id_display}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.product_name}</TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                           <Button variant="outline" size="sm" asChild>
                              <Link href={`/invoice/${order.id}`}>
                                <FileText className="mr-2 h-4 w-4"/>
                                View Invoice
                              </Link>
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">You haven't placed any orders yet.</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All your future orders will be shown here.
                </p>
                <Button asChild variant="default" className="mt-4">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
