'use client';

import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, isAdmin, logout } = useAuth();

  const getDashboardTitle = () => {
    return isAdmin ? 'Admin Dashboard' : 'User Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">{getDashboardTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{user?.email}</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}