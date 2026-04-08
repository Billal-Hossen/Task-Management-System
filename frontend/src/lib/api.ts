import { LoginDto, LoginResponse, Task, CreateTaskDto, UpdateTaskDto, AuditLog } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5000; // 5 seconds cache

  private getHeaders() {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options?: RequestInit, useCache = true) {
    try {
      // Check if token exists for authenticated requests (except login)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token && !endpoint.includes('/auth/login')) {
        // Silent fail - no token means user is logged out
        throw new Error('No authentication token');
      }

      // Check cache for GET requests
      if (useCache && (!options || options.method === 'GET')) {
        const cacheKey = `${endpoint}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.data;
        }
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(error.message || 'API request failed');
      }

      const data = await response.json();

      // Cache GET requests
      if (useCache && (!options || options.method === 'GET')) {
        const cacheKey = `${endpoint}`;
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error: any) {
      // Re-throw the error to be handled by the caller
      throw error;
    }
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

  async getAssignableUsers(): Promise<any[]> {
    return this.request('/users/assignable');
  }
}

export const api = new ApiClient();