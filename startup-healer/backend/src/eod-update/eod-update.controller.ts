import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EodUpdateService } from './eod-update.service';
import { CreateEodUpdateDto } from './dto/eod-update.dto';

@Controller('eod-updates')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EodUpdateController {
  constructor(private readonly eodUpdateService: EodUpdateService) {}

  @Post()
  @Roles('bda')
  create(@Body() dto: CreateEodUpdateDto, @Request() req: any) {
    return this.eodUpdateService.create(dto, req.user.id);
  }

  @Get('my')
  @Roles('bda')
  findMy(@Request() req: any) {
    return this.eodUpdateService.findMy(req.user.id);
  }

  @Get('employee/:employeeId')
  @Roles('admin')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.eodUpdateService.findByEmployee(employeeId);
  }
}
