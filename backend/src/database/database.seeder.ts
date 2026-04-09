import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seedUsers() {
    // Check if users already exist
    const userCount = await this.usersRepository.count();

    if (userCount > 0) {
      this.logger.log('Users already exist, skipping seed');
      return;
    }

    // Create Admin User
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = this.usersRepository.create({
      email: 'admin@taskmanager.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    });
    await this.usersRepository.save(admin);
    this.logger.log('Admin user created: admin@taskmanager.com / Admin123!');

    // Create Normal Users
    const normalUsers = [
      {
        email: 'john.doe@taskmanager.com',
        name: 'John Doe',
        password: 'User123!',
      },
      {
        email: 'jane.smith@taskmanager.com',
        name: 'Jane Smith',
        password: 'User123!',
      },
      {
        email: 'bob.wilson@taskmanager.com',
        name: 'Bob Wilson',
        password: 'User123!',
      },
      {
        email: 'alice.brown@taskmanager.com',
        name: 'Alice Brown',
        password: 'User123!',
      },
    ];

    for (const userData of normalUsers) {
      const userPassword = await bcrypt.hash(userData.password, 10);
      const user = this.usersRepository.create({
        email: userData.email,
        name: userData.name,
        password: userPassword,
        role: UserRole.USER,
      });
      await this.usersRepository.save(user);
      this.logger.log(`User created: ${userData.email} / ${userData.password}`);
    }

    this.logger.log(`Seeding completed: 1 Admin + ${normalUsers.length} Users created`);
  }
}
