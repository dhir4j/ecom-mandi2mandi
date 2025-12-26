'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://www.mandi.ramhotravels.com/api/auth';

type UserRole = 'farmer' | 'trader' | 'buyer' | 'admin';

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResult = {
  success: boolean;
  user?: User;
  error?: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string, password: string }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<AuthResult>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/status`, {
        credentials: 'include', // Important for sending cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.logged_in) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        if (response.status >= 500) {
           toast({
            title: 'Server Error',
            description: 'The authentication service is currently unavailable. Please try again later.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
      setUser(null);
       toast({
        title: 'Connection Error',
        description: 'Could not connect to the authentication service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (credentials: {email: string, password: string}): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  }, [router]);

  const signup = async (userData: any): Promise<AuthResult> => {
     try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.status === 201) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }
  
  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    signup,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
