import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateTargetDto {
  @IsUUID()
  @IsNotEmpty()
  employee_id: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  target_value: number;
}

export class UpdateTargetDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  achieved_value?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  target_value?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
