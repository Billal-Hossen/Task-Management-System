import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seedUsers() {
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: 'admin@taskmanager.com' },
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('Admin123!', 10);
      const admin = this.usersRepository.create({
        email: 'admin@taskmanager.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await this.usersRepository.save(admin);
      console.log('Admin user created: admin@taskmanager.com / Admin123!');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email: 'user@taskmanager.com' },
    });

    if (!existingUser) {
      const userPassword = await bcrypt.hash('User123!', 10);
      const user = this.usersRepository.create({
        email: 'user@taskmanager.com',
        password: userPassword,
        role: UserRole.USER,
      });
      await this.usersRepository.save(user);
      console.log('User created: user@taskmanager.com / User123!');
    }
  }
}