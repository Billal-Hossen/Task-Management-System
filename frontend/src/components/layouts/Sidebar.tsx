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
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Audit Logs', href: '/admin/audit' },
    { label: 'Users', href: '/admin/users' },
  ];

  const userNavItems = [
    { label: 'User Dashboard', href: '/user/dashboard' },
    { label: 'My Tasks', href: '/user/dashboard' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside
      className="flex flex-col text-white"
      style={{
        width: '240px',
        backgroundColor: '#2563eb',
        minHeight: '100vh',
      }}
    >
      <div className="p-6 border-b" style={{ borderColor: '#1d4ed8' }}>
        <h1 className="text-xl font-bold">{getSidebarTitle()}</h1>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-3 transition-colors ${
              pathname === item.href
                ? 'font-bold border-r-4'
                : 'hover:opacity-90'
            }`}
            style={
              pathname === item.href
                ? {
                    backgroundColor: '#1d4ed8',
                    borderColor: '#ffffff',
                  }
                : {}
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: '#1d4ed8' }}>
        <Link
          href="/profile"
          className="block px-6 py-3 hover:opacity-90 transition-colors"
        >
          Profile
        </Link>
      </div>
    </aside>
  );
}