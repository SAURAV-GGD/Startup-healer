import { IsNotEmpty, IsString, IsOptional, IsUUID, IsIn } from 'class-validator';

export class CreateServiceApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  service_name: string;
}

export class UpdateServiceStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'under_review', 'in_progress', 'approved', 'completed', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  admin_remark?: string;
}
