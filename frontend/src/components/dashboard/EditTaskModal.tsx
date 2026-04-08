'use client';

import { useState, useEffect } from 'react';
import { Task, UpdateTaskDto, User } from '@/types';
import { api } from '@/lib/api';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, onTaskUpdated, task }: EditTaskModalProps) {
  const [formData, setFormData] = useState<UpdateTaskDto>({
    title: '',
    description: '',
    status: 'PENDING',
    assignedToId: undefined,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && users.length === 0) {
        try {
          setFetchingUsers(true);
          const usersData = await api.getAssignableUsers();
          setUsers(usersData);
        } catch (error: any) {
          console.error('Failed to fetch users:', error);
          // Silently ignore auth errors during logout
          if (error.message !== 'No authentication token') {
            alert(error.message || 'Failed to load users');
          }
        } finally {
          setFetchingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen, users.length]);

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        assignedToId: task.assignedToId || undefined,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task?.id) return;

    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.updateTask(task.id, formData);
      alert('Task updated successfully!');

      onTaskUpdated();
      onClose();
    } catch (error: any) {
      // Silently ignore auth errors during logout
      if (error.message !== 'No authentication token') {
        alert(error.message || 'Failed to update task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Auto-update status based on assignee (for admin)
      if (name === 'assignedToId') {
        if (value) {
          // Task is assigned → set to TODO
          updated.status = 'TODO';
        } else {
          // Task is unassigned → set to PENDING
          updated.status = 'PENDING';
        }
      }

      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task title"
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task description"
              disabled={loading}
            />
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Assignee Field */}
          <div>
            <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              id="assignedToId"
              name="assignedToId"
              value={formData.assignedToId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading || fetchingUsers}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
