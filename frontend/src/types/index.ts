export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'PENDING' | 'PROCESSING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId: string | null;
  assignedTo: User | null;
  createdById: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actor: User;
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ASSIGNMENT_CHANGE';
  entityType: string;
  entityId: string;
  relevantData: Record<string, any>;
  createdAt: string;
  // Formatted fields from backend
  timestamp?: string;
  username?: string;
  action?: string;
  details?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  assignedToId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedToId?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}