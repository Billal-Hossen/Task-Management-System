'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated or not admin (after loading completes)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const fetchData = useCallback(async () => {
    try {
      const usersData = await api.getUsers();
      setUsers(usersData);
    } catch (error: any) {
      // Silently ignore "No authentication token" errors (happens during logout)
      if (error.message !== 'No authentication token') {
        console.error('Failed to fetch users:', error);
        alert(error.message || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, fetchData]);

  // Don't render if loading auth or if redirecting
  if (isLoading || !isAuthenticated || !isAdmin) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-200 text-purple-800';
      case 'USER':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 px-4 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage system users</p>
        </div>

        <div className="bg-white rounded-lg shadow-panel overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Created At
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
