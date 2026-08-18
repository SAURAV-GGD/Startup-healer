import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.taskService.findAll();
  }

  @Get('my')
  @Roles('bda')
  findMyTasks(@Request() req: any) {
    return this.taskService.findMyTasks(req.user.id);
  }

  @Get('my/today')
  @Roles('bda')
  findTodayTasks(@Request() req: any) {
    return this.taskService.findTodayTasks(req.user.id);
  }

  @Get('due-today/count')
  @Roles('admin')
  getTasksDueToday() {
    return this.taskService.getTasksDueToday();
  }

  @Get('overdue/count')
  @Roles('admin')
  getOverdueTasks() {
    return this.taskService.getOverdueTasks();
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.taskService.findByEmployee(employeeId);
  }

  @Put(':id/status')
  @Roles('bda')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto, @Request() req: any) {
    return this.taskService.updateStatus(id, dto, req.user.id);
  }
}
