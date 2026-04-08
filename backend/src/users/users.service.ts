import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAssignableUsers() {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      where: { role: UserRole.USER }, // Only return non-admin users for task assignment
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}