'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuditLogTable } from '@/components/dashboard/AuditLogTable';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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
      const logsData = await api.getAuditLogs();
      setAuditLogs(logsData);
    } catch (error: any) {
      // Silently ignore "No authentication token" errors (happens during logout)
      if (error.message !== 'No authentication token') {
        console.error('Failed to fetch audit logs:', error);
        alert(error.message || 'Failed to load audit logs');
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
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 text-sm sm:text-base">View system activity and changes</p>
        </div>

        <div>
          <AuditLogTable logs={auditLogs} />
        </div>
      </div>
    </MainLayout>
  );
}
