'use client';

import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { User, Crown, Calendar, Mail, Phone, ShieldCheck, Package, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { SubscriptionPaywall } from '@/components/subscription-paywall';

export default function AccountPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center">
          <p>Loading...</p>
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
              <CardDescription>You must be logged in to view your account.</CardDescription>
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

  const hasActiveSubscription = user?.hasSubscription && user?.subscriptionExpiry
    ? new Date(user.subscriptionExpiry) > new Date()
    : false;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="bg-primary/10 p-4 rounded-full flex-shrink-0">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-2xl md:text-3xl font-headline truncate">{user?.name}</CardTitle>
                    <CardDescription className="text-sm md:text-base mt-1 truncate">
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="text-sm flex-shrink-0">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-primary" />
                <CardTitle>Subscription Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasActiveSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Pro Plan Active</p>
                        <p className="text-sm text-muted-foreground">Unlimited access to seller contacts</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-sm">
                      ACTIVE
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Expires On</p>
                        <p className="font-semibold">
                          {new Date(user.subscriptionExpiry!).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Plan Price</p>
                        <p className="font-semibold">₹199/month</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => setShowPaywall(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Renew Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                    <Crown className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="font-semibold text-lg mb-2">Free Plan</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upgrade to Pro to unlock seller contact details
                    </p>
                    <Button onClick={() => setShowPaywall(true)} size="lg">
                      <Crown className="mr-2 h-5 w-5" />
                      Upgrade to Pro - ₹199/month
                    </Button>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Pro Plan Benefits:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Unlimited access to seller contact details
                      </li>
                      <li className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Direct phone numbers for all products
                      </li>
                      <li className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Priority inquiry support
                      </li>
                      <li className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email notifications for new products
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                  <p className="font-semibold capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role === 'trader' && (
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Listings
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/my-orders">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Subscription Paywall Modal */}
      <SubscriptionPaywall
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onSuccess={() => {
          setShowPaywall(false);
          window.location.reload(); // Reload to update subscription status
        }}
      />
    </div>
  );
}
