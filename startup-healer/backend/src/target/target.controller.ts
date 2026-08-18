import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TargetService } from './target.service';
import { CreateTargetDto, UpdateTargetDto } from './dto/target.dto';

@Controller('targets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateTargetDto) {
    return this.targetService.create(dto);
  }

  @Get('my')
  @Roles('bda')
  findMyTargets(@Request() req: any) {
    return this.targetService.findMyTargets(req.user.id);
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.targetService.findByEmployee(employeeId);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateTargetDto) {
    return this.targetService.update(id, dto);
  }
}
