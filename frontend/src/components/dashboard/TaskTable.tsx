'use client';

import { Task, TaskStatus } from '@/types';
import { api } from '@/lib/api';

interface TaskTableProps {
  tasks: Task[];
  onRefresh: () => void;
  onEditTask?: (task: Task) => void;
}

export function TaskTable({ tasks, onRefresh, onEditTask }: TaskTableProps) {
  const handleDelete = async (id: string) => {
    if (!id) return;

    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        onRefresh?.();
      } catch (error: any) {
        console.error('Delete error:', error);
        // Show error only if it's not a "no authentication token" error
        if (error.message !== 'No authentication token') {
          alert(error.message || 'Failed to delete task');
        }
      }
    }
  };

  const getStatusBadge = (status?: TaskStatus) => {
    if (!status) {
      return {
        label: 'Unknown',
        style: {
          backgroundColor: '#e5e7eb',
          color: '#374151',
        },
      };
    }

    switch (status) {
      case 'TODO':
        return {
          label: 'Todo',
          style: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
          },
        };
      case 'PENDING':
        return {
          label: 'Pending',
          style: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
          },
        };
      case 'PROCESSING':
        return {
          label: 'In Progress',
          style: {
            backgroundColor: '#bfdbfe',
            color: '#1e40af',
          },
        };
      case 'DONE':
        return {
          label: 'Done',
          style: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
          },
        };
      default:
        return {
          label: status,
          style: {
            backgroundColor: '#e5e7eb',
            color: '#374151',
          },
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-panel overflow-x-auto">
      <div className="min-w-full">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Assignee
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks?.map((task) => (
              <tr key={task?.id || Math.random()} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task?.title || 'Untitled'}</div>
                  <div className="text-sm text-gray-500 hidden sm:block">{task?.description || ''}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900">
                    {task?.assignedTo?.name || task?.assignedTo?.email || 'Unassigned'}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={getStatusBadge(task?.status)?.style}
                  >
                    {getStatusBadge(task?.status)?.label || task?.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => task && onEditTask?.(task)}
                      className="px-3 py-1 rounded text-white font-medium text-xs sm:text-sm"
                      style={{
                        backgroundColor: '#2563eb',
                      }}
                      onMouseEnter={(e) => {
                        if (e.currentTarget) e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        if (e.currentTarget) e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => task?.id && handleDelete(task.id)}
                      className="px-3 py-1 rounded text-white font-medium text-xs sm:text-sm"
                      style={{
                        backgroundColor: '#ef4444',
                      }}
                      onMouseEnter={(e) => {
                        if (e.currentTarget) e.currentTarget.style.backgroundColor = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        if (e.currentTarget) e.currentTarget.style.backgroundColor = '#ef4444';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found
        </div>
      ) : null}
    </div>
  );
}