'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const getSidebarTitle = () => {
    return isAdmin ? 'Admin Dashboard' : 'User Dashboard';
  };

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Audit Logs', href: '/admin/audit', icon: '📝' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
  ];

  const userNavItems = [
    { label: 'Dashboard', href: '/user/dashboard', icon: '🏠' },
    { label: 'My Tasks', href: '/user/tasks', icon: '📋' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-blue-600">
        <h1 className="text-xl font-bold">{getSidebarTitle()}</h1>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 transition-colors ${
              pathname === item.href
                ? 'bg-blue-700 border-r-4 border-white'
                : 'hover:bg-blue-700'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-600">
        <Link
          href="/profile"
          className="flex items-center px-2 py-2 hover:bg-blue-700 rounded transition-colors"
        >
          <span className="text-xl mr-3">👤</span>
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
}