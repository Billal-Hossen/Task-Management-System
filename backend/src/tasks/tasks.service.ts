import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserRole } from '../users/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { ActionType } from '../audit/audit.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private auditService: AuditService,
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
    // Set status based on whether task is assigned
    // Unassigned tasks → PENDING (Pending)
    // Assigned tasks → TODO (Todo)
    const taskStatus = createTaskDto.assignedToId ? TaskStatus.PENDING : TaskStatus.TODO;

    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: taskStatus,
      createdById: actorId,
    });

    const savedTask = await this.tasksRepository.save(task);

    // If task was assigned during creation, create an additional audit log for assignment
    if (createTaskDto.assignedToId) {
      await this.auditService.logAction({
        actorId,
        actionType: ActionType.ASSIGNMENT_CHANGE,
        entityType: 'Tasks',
        entityId: savedTask.id,
        relevantData: {
          title: savedTask.title,
          assignedToId: createTaskDto.assignedToId,
          assigneeEmail: savedTask.assignedTo?.email,
          newlyCreated: true,
        },
      });
    }

    return savedTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, actorId: string, actorRole: UserRole) {
    const task = await this.findOne(id);

    if (actorRole !== UserRole.ADMIN && task.assignedToId !== actorId) {
      throw new ForbiddenException('You can only update your assigned tasks');
    }

    // Track if this is an assignment change
    const isAssignmentChange = updateTaskDto.assignedToId !== undefined &&
                               updateTaskDto.assignedToId !== task.assignedToId;

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);

    // Load relations to get assignee email
    const taskWithRelations = await this.tasksRepository.findOne({
      where: { id: updatedTask.id },
      relations: ['assignedTo'],
    });

    // Return with additional metadata for audit logging
    return {
      ...taskWithRelations,
      isAssignmentChange,
    };
  }

  async updateStatus(id: string, status: TaskStatus, actorId: string, actorRole?: UserRole) {
    const task = await this.findOne(id);

    if (task.assignedToId !== actorId) {
      throw new ForbiddenException('You can only update your assigned tasks');
    }

    const oldStatus = task.status;

    // Validate status transitions for non-admin users
    if (actorRole !== UserRole.ADMIN) {
      const validTransitions = this.getValidTransitions(oldStatus);
      if (!validTransitions.includes(status)) {
        throw new ForbiddenException(
          `Invalid status transition. Cannot change from "${oldStatus}" to "${status}". ` +
          `Valid transitions from "${oldStatus}": ${validTransitions.map(s => `"${s}"`).join(', ')}`
        );
      }
    }

    task.status = status;
    const updatedTask = await this.tasksRepository.save(task);

    // Return task with oldStatus for audit logging
    return {
      ...updatedTask,
      oldStatus,
    };
  }

  private getValidTransitions(currentStatus: TaskStatus): TaskStatus[] {
    switch (currentStatus) {
      case TaskStatus.PENDING: // Todo
        return [TaskStatus.PROCESSING]; // Can only go to In Progress
      case TaskStatus.PROCESSING: // In Progress
        return [TaskStatus.DONE, TaskStatus.PENDING]; // Can go to Done or back to Todo
      case TaskStatus.DONE: // Done
        return [TaskStatus.PROCESSING]; // Can only go back to In Progress
      default:
        return [];
    }
  }

  async delete(id: string, actorId: string) {
    const task = await this.findOne(id);
    const taskTitle = task.title; // Store title before deletion
    await this.tasksRepository.remove(task);

    // Return task title for audit logging
    return {
      message: 'Task deleted successfully',
      title: taskTitle,
    };
  }
}