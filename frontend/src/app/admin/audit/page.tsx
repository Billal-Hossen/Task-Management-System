'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuditLogTable } from '@/components/dashboard/AuditLogTable';
import { api } from '@/lib/api';
import { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const logsData = await api.getAuditLogs();
      setAuditLogs(logsData);
    } catch (error: any) {
      console.error('Failed to fetch audit logs:', error);
      alert(error.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">View system activity and changes</p>
        </div>

        <div>
          <AuditLogTable logs={auditLogs} />
        </div>
      </div>
    </MainLayout>
  );
}
