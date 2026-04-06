import { LoginDto, LoginResponse, Task, CreateTaskDto, UpdateTaskDto, AuditLog } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private getHeaders() {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginDto): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Task endpoints
  async getTasks(): Promise<Task[]> {
    return this.request('/tasks');
  }

  async getTask(id: string): Promise<Task> {
    return this.request(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateTaskStatus(id: string, status: 'PENDING' | 'PROCESSING' | 'DONE'): Promise<Task> {
    return this.request(`/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Audit endpoints
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.request('/audit');
  }

  // User endpoints
  async getUsers(): Promise<any[]> {
    return this.request('/users');
  }
}

export const api = new ApiClient();