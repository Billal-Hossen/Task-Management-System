'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchData = async () => {
    try {
      const tasksData = await api.getTasks();
      // Filter out PENDING tasks - users should only see TODO, PROCESSING, DONE
      const filteredTasks = tasksData.filter(task => task.status !== 'PENDING');
      setTasks(filteredTasks);
    } catch (error: any) {
      // Silently ignore "No authentication token" errors (happens during logout)
      if (error.message !== 'No authentication token') {
        console.error('Failed to fetch data:', error);
        alert(error.message || 'Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  // Don't render if redirecting
  if (!isAuthenticated || isAdmin) {
    return null;
  }

  const handleStatusChange = async (taskId: string, newStatus: 'PENDING' | 'PROCESSING' | 'DONE') => {
    try {
      await api.updateTaskStatus(taskId, newStatus);

      // Update local state immediately for instant UI feedback
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setOpenDropdownId(null);
    } catch (error: any) {
      alert(error.message || 'Failed to update task status');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'Todo';
      case 'PENDING':
        return 'Pending';
      case 'PROCESSING':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  const getValidTransitions = (currentStatus: string): typeof tasks => {
    switch (currentStatus) {
      case 'TODO': // Todo
        return [
          { status: 'PROCESSING', label: 'In Progress' }
        ];
      case 'PROCESSING': // In Progress
        return [
          { status: 'DONE', label: 'Done' },
          { status: 'TODO', label: 'Todo' }
        ];
      case 'DONE': // Done
        return [{ status: 'PROCESSING', label: 'In Progress' }];
      default:
        return [];
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
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h2>
          <div className="bg-white rounded-lg shadow-panel overflow-x-auto" style={{ minHeight: '400px' }}>
            <div className="min-w-full">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === task.id ? null : task.id)}
                            className="px-3 py-1 rounded text-white font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                            style={{
                              backgroundColor: '#3b82f6',
                            }}
                            onMouseEnter={(e) => {
                              if (openDropdownId !== task.id) {
                                e.currentTarget.style.backgroundColor = '#2563eb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (openDropdownId !== task.id) {
                                e.currentTarget.style.backgroundColor = '#3b82f6';
                              }
                            }}
                          >
                            {getStatusLabel(task.status)}
                            <span className="text-xs">▼</span>
                          </button>

                          {openDropdownId === task.id && (
                            <div
                              className="absolute z-50 mt-1 w-36 sm:w-40 rounded-md shadow-lg bg-white border border-gray-200 overflow-hidden"
                              style={{
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              }}
                            >
                              <div className="py-1 max-h-40 overflow-y-auto">
                                {getValidTransitions(task.status).length === 0 ? (
                                  <div className="px-4 py-2 text-sm text-gray-500">
                                    No valid transitions
                                  </div>
                                ) : (
                                  getValidTransitions(task.status).map((transition) => (
                                    <button
                                      key={transition.status}
                                      onClick={() => handleStatusChange(task.id, transition.status as any)}
                                      className={`block w-full text-left px-4 py-2 text-sm whitespace-nowrap ${
                                        task.status === transition.status
                                          ? 'bg-blue-500 text-white'
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      {transition.label}
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tasks assigned to you
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}