'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoggingOut: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // Load user from localStorage on mount (synchronously before paint)
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          // Clear invalid data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      // Mark loading as complete regardless of outcome
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });

      if (response?.access_token && response?.user) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setToken(response.access_token);
        setUser(response.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsLoggingOut(true); // Prevent API calls during logout
    // Clear localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Clear state
    setToken(null);
    setUser(null);
    // Force redirect to login page immediately
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !isLoggingOut,
        isAdmin: user?.role === 'ADMIN',
        isLoggingOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}