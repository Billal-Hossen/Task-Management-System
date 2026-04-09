'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-4 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">View your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-panel p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="text-sm text-gray-900">{user.name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="text-sm text-gray-900 break-all">{user.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="text-sm text-gray-900">{user.role}</div>
            </div>

            {user.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <div className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
