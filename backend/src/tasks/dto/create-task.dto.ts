import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Implement JWT-based authentication with login and logout functionality',
    description: 'Detailed task description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: TaskStatus.PENDING,
    description: 'Initial task status',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'UUID of the user assigned to this task',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}