import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SalarySlipService } from './salary-slip.service';

@Controller('salary-slips')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SalarySlipController {
  constructor(private readonly salarySlipService: SalarySlipService) {}

  @Post()
  @Roles('admin')
  upload(@Body() body: { employee_id: string; month: number; year: number; file_url: string; file_name: string }) {
    return this.salarySlipService.upload(
      body.employee_id,
      body.month,
      body.year,
      body.file_url,
      body.file_name,
    );
  }

  @Get('my')
  @Roles('bda')
  findMy(@Request() req: any) {
    return this.salarySlipService.findMy(req.user.id);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.salarySlipService.findAll();
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.salarySlipService.findByEmployee(employeeId);
  }
}
