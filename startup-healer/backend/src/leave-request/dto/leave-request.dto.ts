import { IsNotEmpty, IsString, IsDateString, IsOptional, IsIn } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['sick', 'casual', 'paid'])
  leave_type: string;

  @IsDateString()
  @IsNotEmpty()
  from_date: string;

  @IsDateString()
  @IsNotEmpty()
  to_date: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateLeaveStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['approved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  admin_remark?: string;
}
