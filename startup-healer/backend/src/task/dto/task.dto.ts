import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsOptional()
  @IsUUID()
  client_id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  due_date: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}

export class UpdateTaskStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['not_started', 'in_progress', 'completed', 'blocked'])
  status: string;
}
