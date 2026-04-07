'use client';

import { AuditLog } from '@/types';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const getActionColor = (action?: string) => {
    if (!action) return 'bg-gray-100 text-gray-800';

    switch (action) {
      case 'Task Created':
        return 'bg-green-100 text-green-800';
      case 'Task Updated':
        return 'bg-blue-100 text-blue-800';
      case 'Task Deleted':
        return 'bg-red-100 text-red-800';
      case 'Status Changed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Assignment Changed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-panel overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs?.map((log) => (
            <tr key={log?.id || Math.random()} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log?.timestamp || (log?.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log?.username || log?.actor?.email?.split('@')[0] || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log?.action || log?.actionType)}`}>
                  {log?.action || log?.actionType?.replace(/_/g, ' ') || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {log?.details || `${log?.entityType || 'Unknown'} - ID: ${log?.entityId || 'N/A'}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!logs || logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No audit logs found
        </div>
      ) : null}
    </div>
  );
}