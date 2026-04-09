# Task Management System

A complete task management system with team collaboration, role-based access, and automatic activity tracking.

---

## 🚀 Quick Start

### **Get Started in 3 Steps**

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/Billal-Hossen/Task-Management-System.git
   cd Task-Management-System
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/api

### **Stop the application**
   ```bash
   docker-compose down
   ```

---

## 🔐 Demo Accounts

### **Admin Account**
- **Email**: `admin@taskmanager.com`
- **Password**: `Admin123!`
- **Access**: Create/edit/delete tasks, assign tasks, view all activity logs

### **User Accounts**
| Name | Email | Password | Access |
|------|-------|----------|--------|
| John Doe | `john.doe@taskmanager.com` | `User123!` | View assigned tasks, update status |
| Jane Smith | `jane.smith@taskmanager.com` | `User123!` | View assigned tasks, update status |
| Bob Wilson | `bob.wilson@taskmanager.com` | `User123!` | View assigned tasks, update status |
| Alice Brown | `alice.brown@taskmanager.com` | `User123!` | View assigned tasks, update status |

---

## ✨ Features

### **Role-Based Access Control**
- **Admins**: Full control - create, edit, delete, and assign tasks
- **Users**: Limited access - view assigned tasks and update status only

### **Automatic Activity Tracking**
- Every action is automatically logged
- Tracks who did what and when
- Complete audit trail for accountability

### **Modern User Interface**
- Clean, responsive design
- Easy task management
- Real-time status updates

---

## 📊 Database Architecture

### **How Data is Organized**

The system uses three main tables that work together:

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
• id (unique)
• email
• password
• role (ADMIN/USER)
• created_at
└─────────────────┘
        │
        │ creates
        ▼
┌─────────────────┐       assigns to       ┌─────────────────┐
│     TASKS       ├─────────────────────→  │     USERS       │
├─────────────────┤                        └─────────────────┘
• id (unique)
• title
• description
• status (PENDING/PROCESSING/DONE)
• assigned_to → users.id
• created_by → users.id
• created_at
• updated_at
└─────────────────┘
        │
        │ every change logs to
        ▼
┌─────────────────┐
│   AUDIT LOGS    │
├─────────────────┤
• id (unique)
• actor_id → users.id
• action_type (CREATE/UPDATE/DELETE/STATUS_CHANGE/ASSIGNMENT_CHANGE)
• entity_type (Task/User)
• entity_id
• relevant_data (JSON details)
• created_at
└─────────────────┘
```

### **Table Relationships Explained**

**Users & Tasks:**
- One user can create many tasks
- One user can be assigned many tasks
- Each task has one creator and one assignee

**Tasks & Audit Logs:**
- Each task can have many audit log entries
- Every change to a task creates a new log entry
- Logs show before/after states

**Users & Audit Logs:**
- Each user can have many audit log entries
- Logs track which user performed which action

### **Using Docker (Recommended)**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Billal-Hossen/Task-Management-System.git
   cd task-management-system
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Swagger Documentation**: http://localhost:3001/api
   - **Database**: localhost:5433

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 🔐 Demo Credentials

### **Admin Account**
- **Email**: `admin@taskmanager.com`
- **Password**: `Admin123!`
- **Name**: Admin User
- **Access**: Full CRUD operations, audit logs, user management

### **User Accounts**
1. **John Doe**
   - Email: `john.doe@taskmanager.com`
   - Password: `User123!`
   - Access: View assigned tasks, update task status

2. **Jane Smith**
   - Email: `jane.smith@taskmanager.com`
   - Password: `User123!`
   - Access: View assigned tasks, update task status

3. **Bob Wilson**
   - Email: `bob.wilson@taskmanager.com`
   - Password: `User123!`
   - Access: View assigned tasks, update task status

4. **Alice Brown**
   - Email: `alice.brown@taskmanager.com`
   - Password: `User123!`
   - Access: View assigned tasks, update task status

## 📁 Project Structure

```
task-management-system/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── auth/              # JWT Authentication
│   │   ├── tasks/             # Task CRUD operations
│   │   ├── audit/             # Audit logging system
│   │   ├── users/             # User management
│   │   ├── database/          # Database configuration & seeding
│   │   └── common/            # Shared utilities & guards
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Next.js Frontend Application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   ├── user/         # User dashboard pages
│   │   │   └── login/        # Authentication page
│   │   ├── components/        # React components
│   │   │   ├── dashboard/    # Task tables, forms, modals
│   │   │   └── layouts/      # Shared layout components
│   │   ├── contexts/          # Authentication context
│   │   ├── lib/               # API client & utilities
│   │   └── types/             # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── docker/                     # Docker configurations
│   └── init.sql               # Database initialization script
├── docker-compose.yml          # Multi-container orchestration
└── README.md                  # This file
```

## 🔌 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login, returns JWT token |

### **Tasks**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/tasks` | Get all tasks | Admin: all, User: assigned only |
| GET | `/tasks/:id` | Get specific task | All users |
| POST | `/tasks` | Create new task | Admin only |
| PUT | `/tasks/:id` | Update task | Admin: all fields, User: status only |
| DELETE | `/tasks/:id` | Delete task | Admin only |

### **Users**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin only |
| GET | `/users/:id` | Get specific user | All users |

### **Audit Logs**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/audit` | Get all audit logs | Admin only |
| GET | `/audit/:entityType/:entityId` | Get logs for specific entity | Admin only |

## 🔌 API Endpoints

### **Authentication**
- `POST /auth/login` - User login, returns JWT token

### **Tasks**
- `GET /tasks` - Get all tasks (Admin: all, User: assigned only)
- `GET /tasks/:id` - Get specific task by ID
- `POST /tasks` - Create new task (Admin only)
- `PUT /tasks/:id` - Update task (Admin: all fields, User: status only)
- `PUT /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete task (Admin only)

### **Users**
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get specific user by ID

### **Audit Logs**
- `GET /audit` - Get all audit logs (Admin only)
- `GET /audit/:entityType/:entityId` - Get logs for specific entity

## 🎯 Usage Examples

### **Admin: Create a Task**
1. Login as admin
2. Go to Dashboard
3. Click "Create Task" button
4. Fill in:
   - Title: "Fix login bug"
   - Description: "Users cannot login with special characters"
   - Status: PENDING
   - Assign to: John Doe
5. Click Submit
6. ✅ Task created and automatically logged

### **User: Update Task Status**
1. Login as user (e.g., John Doe)
2. View assigned tasks in Dashboard
3. Find the task and click the status dropdown
4. Change status:
   - PENDING → PROCESSING (started working)
   - PROCESSING → DONE (completed)
5. ✅ Status updated and automatically logged

### **Admin: View Activity History**
1. Login as admin
2. Click "Audit Logs" in sidebar
3. See complete history:
   - Who made changes
   - What was changed
   - When it happened
   - Before and after values

## 💻 Local Development

### **Backend Only**
```bash
cd backend
npm install
npm run start:dev
```

### **Frontend Only**
```bash
cd frontend
npm install
npm run dev
```

### **Database Only**
```bash
docker-compose up postgres pgadmin
```

## 🔧 Environment Variables

### **Backend (.env)**
```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=taskuser
DATABASE_PASSWORD=taskpass
DATABASE_NAME=task_management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
PORT=3001
NODE_ENV=development
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔒 Security Features

- ✅ **Password encryption** with bcrypt
- ✅ **JWT token authentication** (7-day expiry)
- ✅ **Role-based access control** (Admin/User)
- ✅ **CORS protection** (frontend-only access)
- ✅ **Input validation** on all endpoints
- ✅ **SQL injection prevention** (parameterized queries)
- ✅ **Automatic activity logging** for accountability

---

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Or change ports in docker-compose.yml
# Frontend: 3000, Backend: 3001, Database: 5433
```

### **Database Connection Issues**
```bash
# Check database status
docker-compose ps postgres

# View database logs
docker logs task_management_db

# Restart database
docker-compose restart postgres
```

### **Application Not Starting**
```bash
# Rebuild containers
docker-compose up --build

# Check logs
docker-compose logs
```

---

## 📚 Resources

- **API Documentation**: http://localhost:3001/api (when running)
- **Next.js Documentation**: https://nextjs.org/docs
- **NestJS Documentation**: https://docs.nestjs.com
- **PostgreSQL Documentation**: https://www.postgresql.org/docs

---

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development only)
- npm or yarn package manager
- Modern web browser

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: NestJS, TypeORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT (stateless tokens)
- **Deployment**: Docker Compose
- **API Documentation**: Swagger

---

**Built with ❤️ for efficient team task management**

## 🔒 Security Features

- ✅ **Password encryption** with bcrypt
- ✅ **JWT token authentication** (7-day expiry)
- ✅ **Role-based access control** (Admin/User)
- ✅ **CORS protection** (frontend-only access)
- ✅ **Input validation** on all endpoints
- ✅ **SQL injection prevention** (parameterized queries)
- ✅ **Automatic activity logging** for accountability

---

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Or change ports in docker-compose.yml
# Frontend: 3000, Backend: 3001, Database: 5433
```

### **Database Connection Issues**
```bash
# Check database status
docker-compose ps postgres

# View database logs
docker logs task_management_db

# Restart database
docker-compose restart postgres
```

### **Application Not Starting**
```bash
# Rebuild containers
docker-compose up --build

# Check logs
docker-compose logs
```

---

## 📚 Resources

- **API Documentation**: http://localhost:3001/api (when running)
- **Next.js Documentation**: https://nextjs.org/docs
- **NestJS Documentation**: https://docs.nestjs.com
- **PostgreSQL Documentation**: https://www.postgresql.org/docs

---

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development only)
- npm or yarn package manager
- Modern web browser

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: NestJS, TypeORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT (stateless tokens)
- **Deployment**: Docker Compose
- **API Documentation**: Swagger

---

**Built with ❤️ for efficient team task management**