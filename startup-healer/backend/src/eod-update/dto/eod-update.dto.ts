import { IsNotEmpty, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateEodUpdateDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsOptional()
  @IsArray()
  task_statuses?: any[];

  @IsOptional()
  @IsString()
  blockers?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
