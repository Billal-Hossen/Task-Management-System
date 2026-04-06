# Database Setup

This folder contains database initialization scripts for the Task Management System.

## Initial Setup

The database will be automatically created by PostgreSQL when the container starts. The application will automatically create the necessary tables using TypeORM's synchronize feature in development mode.

## Default Users

The backend application includes a seeding mechanism that will create default users if they don't exist:

- **Admin User**
  - Email: admin@taskmanager.com
  - Password: Admin123!

- **Regular User**
  - Email: user@taskmanager.com
  - Password: User123!

## Manual Database Operations

### Access database shell
```bash
docker exec -it task_management_db psql -U taskuser -d task_management
```

### Backup database
```bash
docker exec task_management_db pg_dump -U taskuser task_management > backup.sql
```

### Restore database
```bash
docker exec -i task_management_db psql -U taskuser task_management < backup.sql
```

## Production Notes

In production:
1. Disable TypeORM synchronize (`synchronize: false`)
2. Use proper migrations
3. Generate secure password hashes
4. Use strong JWT secrets