-- Database initialization script for Task Management System
-- This script runs on database initialization

-- Insert default admin user
-- Password: Admin123! (pre-hashed with bcrypt, 10 rounds)
INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@taskmanager.com',
  '$2b$10$LQO3kZ5m5o5o5o5o5o5o5e1XZ5o5o5o5o5o5o5o5o5o5o5o5o5',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert default regular user
-- Password: User123! (pre-hashed with bcrypt, 10 rounds)
INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'user@taskmanager.com',
  '$2b$10$UO3kZ5m5o5o5o5o5o5o5e1XZ5o5o5o5o5o5o5o5o5o5o5o5o5o',
  'USER',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Note: These are example hashes. In production, use proper bcrypt hashes.
-- For development, the backend will create users if they don't exist.