'use client';

import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddProductForm } from '@/components/add-product-form';
import { MyListings } from '@/components/my-listings';
import { LayoutGrid, AlertTriangle, BarChart3, Package, ShoppingCart, MessageSquare, TrendingUp, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { SellerDashboardOverview } from '@/components/seller-dashboard-overview';
import { SellerEnquiries } from '@/components/seller-enquiries';
import { SellerOrders } from '@/components/seller-orders';
import { SellerChat } from '@/components/seller-chat';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setActiveTab('products');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center shadow-lg">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You must be logged in to view the dashboard.</CardDescription>
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

  if (user?.role !== 'farmer' && user?.role !== 'trader') {
    return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
            <Card className="max-w-md w-full text-center shadow-lg">
              <CardHeader>
                 <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit mb-4">
                    <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
                <CardTitle>Permission Denied</CardTitle>
                <CardDescription>This dashboard is only available for Farmers and Traders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
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
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
                <LayoutGrid className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold font-headline">Welcome to your Dashboard, {user?.name}!</h1>
                <p className="text-muted-foreground">Manage your products and view your listings.</p>
            </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-1 h-auto md:h-10 p-1">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="text-xs md:text-sm">
              <MessageSquare className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Enquiries</span>
              <span className="md:hidden">Enq.</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm">
              <ShoppingCart className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Orders</span>
              <span className="md:hidden">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs md:text-sm">
              <Package className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Products</span>
              <span className="md:hidden">Prod.</span>
            </TabsTrigger>
            <TabsTrigger value="add-product" className="text-xs md:text-sm">
              <Package className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Add Product</span>
              <span className="md:hidden">Add</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs md:text-sm">
              <MessageSquare className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Messages</span>
              <span className="md:hidden">Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <SellerDashboardOverview />
          </TabsContent>

          <TabsContent value="enquiries" className="mt-6">
            <SellerEnquiries />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <SellerOrders />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <MyListings key={refreshKey} />
          </TabsContent>

          <TabsContent value="add-product" className="mt-6">
            <AddProductForm onProductAdded={handleProductAdded} />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <SellerChat />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
