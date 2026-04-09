import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@taskmanager.com',
    description: 'User email address',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'User password (min 6 characters)',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
