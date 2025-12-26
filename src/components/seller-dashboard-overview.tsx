'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, IndianRupee, Package, ShoppingCart, MessageSquare, Eye, Clock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Demo data for seller dashboard
const stats = {
  totalRevenue: 2_45_680,
  monthlyRevenue: 45_280,
  revenueGrowth: 12.5,
  totalProducts: 24,
  activeProducts: 18,
  totalOrders: 156,
  pendingOrders: 8,
  completedOrders: 142,
  newEnquiries: 12,
  totalEnquiries: 87,
  productViews: 3_420,
  averageOrderValue: 1_575,
};

const recentActivity = [
  { type: 'order', title: 'New order received', subtitle: 'Wheat - 500 Kg by Rajesh Kumar', time: '10 mins ago', amount: 12500 },
  { type: 'enquiry', title: 'New enquiry', subtitle: 'Rice - 1000 Kg inquiry from Mumbai', time: '25 mins ago' },
  { type: 'order', title: 'Order delivered', subtitle: 'Turmeric - 200 Kg to Delhi', time: '1 hour ago', amount: 8600 },
  { type: 'enquiry', title: 'New enquiry', subtitle: 'Soybean - 750 Kg inquiry from Pune', time: '2 hours ago' },
  { type: 'payment', title: 'Payment received', subtitle: 'Order #ORD000142', time: '3 hours ago', amount: 15200 },
];

const topProducts = [
  { name: 'Wheat (Grade A)', sales: 4200, revenue: 189000, trend: 'up', growth: 15 },
  { name: 'Rice (Basmati)', sales: 3100, revenue: 155000, trend: 'up', growth: 8 },
  { name: 'Turmeric', sales: 1800, revenue: 72000, trend: 'down', growth: -3 },
  { name: 'Soybean', sales: 2400, revenue: 96000, trend: 'up', growth: 12 },
];

export function SellerDashboardOverview() {
  const [showDemo, setShowDemo] = useState(false);

  // Check if user has any products/activity (in real app, this would come from API)
  const hasActivity = false; // Set to true when user has actual data

  if (!hasActivity && !showDemo) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Welcome to Your Dashboard!</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by listing your products. Once you add products and receive orders, your dashboard will come alive with insights and analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="?tab=add-product">
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Product
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
              <Eye className="mr-2 h-5 w-5" />
              View Demo Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showDemo && !hasActivity && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                You're viewing demo data. Add products to see your actual dashboard.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDemo(false)}>
              Hide Demo
            </Button>
          </CardContent>
        </Card>
      )}
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{stats.revenueGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalProducts} total products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newEnquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalEnquiries} total enquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Activity Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Top Products */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best-selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{product.name}</p>
                      {product.trend === 'up' ? (
                        <Badge variant="default" className="gap-1 bg-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {product.growth}%
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {Math.abs(product.growth)}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{product.sales} Kg sold</span>
                      <span>₹{product.revenue.toLocaleString('en-IN')} revenue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'enquiry' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="h-4 w-4" />}
                    {activity.type === 'enquiry' && <MessageSquare className="h-4 w-4" />}
                    {activity.type === 'payment' && <IndianRupee className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.amount && (
                        <span className="text-xs font-medium text-green-600 ml-auto">
                          +₹{activity.amount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productViews.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.averageOrderValue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
