
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// This is the new index page for the /admin route.
// Its only job is to redirect the user to the correct page.
export default function AdminIndexPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    // Wait until authentication status is resolved
    if (!isLoading) {
      if (isAuthenticated && user?.role === 'admin') {
        // If logged in as admin, go to the dashboard
        router.replace('/admin/dashboard');
      } else {
        // Otherwise, go to the admin login page
        router.replace('/admin/login');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Return null or a loading spinner while the redirect is happening
  return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
  );
}
