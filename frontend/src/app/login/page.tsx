'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Redirect based on role
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-lg shadow-panel w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome to Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo credentials:</p>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Admin Account:</p>
            <p className="text-xs">admin@taskmanager.com / Admin123!</p>
            <p className="font-medium text-gray-700 mt-2">User Accounts:</p>
            <p className="text-xs">john.doe@taskmanager.com / User123!</p>
            <p className="text-xs">jane.smith@taskmanager.com / User123!</p>
            <p className="text-xs">bob.wilson@taskmanager.com / User123!</p>
            <p className="text-xs">alice.brown@taskmanager.com / User123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}