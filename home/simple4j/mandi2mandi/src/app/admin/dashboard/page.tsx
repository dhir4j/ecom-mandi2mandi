
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';
import { AdminOrderManagement } from '@/components/admin-order-management';
import { AdminProductApproval } from '@/components/admin-product-approval';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, user, router]);
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/30">
          <Header />
          <main className="flex-grow container mx-auto py-12 px-4">
            <Skeleton className="h-12 w-1/2 mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    // This is a fallback, the useEffect should have already redirected.
     return (
      <div className="flex flex-col min-h-screen bg-secondary/30">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit mb-4">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You do not have permission to view this page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/login">Go to Admin Login</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
                <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage orders, products, and users.</p>
            </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="orders">Manage Orders</TabsTrigger>
            <TabsTrigger value="products">Product Approvals</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            <AdminOrderManagement />
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <AdminProductApproval />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
