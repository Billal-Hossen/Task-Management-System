'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { TaskTable } from '@/components/dashboard/TaskTable';
import { CreateTaskModal } from '@/components/dashboard/CreateTaskModal';
import { api } from '@/lib/api';
import { Task } from '@/types';

export default function AdminDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const tasksData = await api.getTasks();
      setTasks(tasksData);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      alert(error.message || 'Failed to load data');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage tasks and view audit logs</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Create Task
          </button>
        </div>

        {/* Task List - Main Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h2>
          <TaskTable tasks={tasks} onRefresh={fetchData} />
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onTaskCreated={handleTaskCreated}
      />
    </MainLayout>
  );
}