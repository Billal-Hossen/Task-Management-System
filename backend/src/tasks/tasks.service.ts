import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll() {
    return this.tasksRepository.find({
      relations: ['assignedTo', 'createdBy'],
    });
  }

  async findAssignedTasks(userId: string) {
    return this.tasksRepository.find({
      where: { assignedToId: userId },
      relations: ['assignedTo', 'createdBy'],
    });
  }

  async findOne(id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedTo', 'createdBy'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, actorId: string) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      createdById: actorId,
    });
    return await this.tasksRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, actorId: string, actorRole: UserRole) {
    const task = await this.findOne(id);

    if (actorRole !== UserRole.ADMIN && task.assignedToId !== actorId) {
      throw new ForbiddenException('You can only update your assigned tasks');
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async updateStatus(id: string, status: TaskStatus, actorId: string) {
    const task = await this.findOne(id);

    if (task.assignedToId !== actorId) {
      throw new ForbiddenException('You can only update your assigned tasks');
    }

    task.status = status;
    return await this.tasksRepository.save(task);
  }

  async delete(id: string, actorId: string) {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}