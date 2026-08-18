import { IsNotEmpty, IsString, IsEmail, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;

  @IsOptional()
  @IsUUID()
  assigned_employee_id?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phone?: string;

  @IsOptional()
  @IsUUID()
  assigned_employee_id?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
