import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../entities/task.entity';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class UpdateTaskDto extends PartialType(OmitType(CreateTaskDto, [] as const)) {}

// Add explicit ApiProperty decorators for better Swagger documentation
export class UpdateTaskDtoExtended {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Updated task title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Implement JWT-based authentication with login and logout functionality',
    description: 'Updated task description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: TaskStatus.PROCESSING,
    description: 'Updated task status',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'UUID of the user assigned to this task',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
