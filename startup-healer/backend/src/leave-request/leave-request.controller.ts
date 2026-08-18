import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave-request.dto';

@Controller('leave-requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  @Roles('bda')
  create(@Body() dto: CreateLeaveRequestDto, @Request() req: any) {
    return this.leaveRequestService.create(dto, req.user.id);
  }

  @Get('my')
  @Roles('bda')
  findMy(@Request() req: any) {
    return this.leaveRequestService.findMy(req.user.id);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.leaveRequestService.findAll();
  }

  @Get('pending')
  @Roles('admin')
  findPending() {
    return this.leaveRequestService.findPending();
  }

  @Put(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeaveStatusDto) {
    return this.leaveRequestService.updateStatus(id, dto);
  }
}
