# Task Management System

A full-stack Task Management System with role-based access control (RBAC), automated audit logging, and modern dashboard UI.

## Features

- **Role-Based Access Control (RBAC)**
  - Admin: Full CRUD access, task assignment, audit log viewing
  - User: View assigned tasks, update status only

- **Automated Audit Logging**
  - All mutations (Create, Update, Delete) automatically logged
  - Captures actor, action type, and data changes
  - Implemented via NestJS interceptors

- **Modern Dashboard UI**
  - Responsive design with Tailwind CSS
  - Real-time task management
  - Audit log viewer

## Tech Stack

- **Frontend**: Next.js 13+ (React), Tailwind CSS
- **Backend**: NestJS, TypeORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT (stateless)
- **Deployment**: Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Swagger Documentation: http://localhost:3001/api

## Default Credentials

- **Admin Account**
  - Email: admin@taskmanager.com
  - Password: Admin123!

- **User Account**
  - Email: user@taskmanager.com
  - Password: User123!

## Project Structure

```
task-management-system/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── tasks/             # Task management
│   │   ├── audit/             # Audit logging
│   │   ├── users/             # User management
│   │   └── common/            # Shared utilities
│   └── Dockerfile
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities
│   └── Dockerfile
├── docker/
│   └── init.sql              # Database seeding
└── docker-compose.yml        # Service orchestration
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Tasks
- `GET /tasks` - Get all tasks (admin) or assigned tasks (user)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create task (admin only)
- `PUT /tasks/:id` - Update task
- `PUT /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete task (admin only)

### Audit Logs
- `GET /audit` - Get all audit logs (admin only)

## Development

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
# Access database shell
docker exec -it task_management_db psql -U taskuser -d task_management

# Backup database
docker exec task_management_db pg_dump -U taskuser task_management > backup.sql

# Restore database
docker exec -i task_management_db psql -U taskuser task_management < backup.sql
```

## Environment Variables

### Backend (.env)
```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=taskuser
DATABASE_PASSWORD=taskpass
DATABASE_NAME=task_management
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- CORS protection
- Input validation
- SQL injection prevention (via TypeORM)
- XSS prevention (via React)

## License

MIT