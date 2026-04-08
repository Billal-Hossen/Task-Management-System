'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { TaskTable } from '@/components/dashboard/TaskTable';
import { CreateTaskModal } from '@/components/dashboard/CreateTaskModal';
import { EditTaskModal } from '@/components/dashboard/EditTaskModal';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/user/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchData = async () => {
    try {
      const tasksData = await api.getTasks();
      setTasks(tasksData);
    } catch (error: any) {
      // Silently ignore "No authentication token" errors (happens during logout)
      if (error.message !== 'No authentication token') {
        console.error('Failed to fetch data:', error);
        alert(error.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleTaskCreated = () => {
    fetchData(); // Refresh data to show the new task
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskUpdated = () => {
    fetchData(); // Refresh data to show updated task
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  // Don't render if redirecting
  if (!isAuthenticated || !isAdmin) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage tasks and view audit logs</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Create Task
          </button>
        </div>

        {/* Task List - Main Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h2>
          <TaskTable tasks={tasks} onRefresh={fetchData} onEditTask={handleEditTask} />
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onTaskCreated={handleTaskCreated}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onTaskUpdated={handleTaskUpdated}
        task={editingTask}
      />
    </MainLayout>
  );
}