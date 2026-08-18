import { Controller, Get, Post, Put, Query, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Roles('bda')
  checkIn(@Request() req: any) {
    return this.attendanceService.checkIn(req.user.id);
  }

  @Put('check-out')
  @Roles('bda')
  checkOut(@Request() req: any) {
    return this.attendanceService.checkOut(req.user.id);
  }

  @Get('my')
  @Roles('bda')
  getMyAttendance(@Request() req: any, @Query('month') month?: string, @Query('year') year?: string) {
    return this.attendanceService.getMyAttendance(
      req.user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('today')
  @Roles('bda')
  getTodayStatus(@Request() req: any) {
    return this.attendanceService.getTodayStatus(req.user.id);
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  getEmployeeAttendance(
    @Param('employeeId') employeeId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.attendanceService.getEmployeeAttendance(
      employeeId,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('summary')
  @Roles('admin')
  getTeamSummary(@Query('month') month?: string, @Query('year') year?: string) {
    return this.attendanceService.getTeamSummary(
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }
}
