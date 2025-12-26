
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success && result.user?.role === 'admin') {
      toast({
        title: 'Admin Login Successful',
        description: "Welcome to the dashboard!",
      });
      
      // Explicitly redirect to /admin/dashboard
      router.push('/admin/dashboard');
      router.refresh(); // Force a refresh to get new auth state
    } else {
      toast({
        title: 'Login Failed',
        description: result.error || 'Invalid credentials or not an admin account.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-lg border-t-4 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-primary/10 rounded-full p-4 w-fit">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
            <CardDescription>Enter your administrator credentials to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <Link href="/" className="font-medium text-muted-foreground hover:text-primary">
                &larr; Back to Main Site
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
