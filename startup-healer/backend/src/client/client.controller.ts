import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Controller('clients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Get()
  @Roles('admin')
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.clientService.findAll(search, status);
  }

  @Get('stats')
  @Roles('admin')
  getStats() {
    return this.clientService.getStats();
  }

  @Get('my/profile')
  @Roles('client')
  getOwnProfile(@Request() req: any) {
    return this.clientService.findOwnProfile(req.user.id);
  }

  @Get('assigned')
  @Roles('bda')
  findAssigned(@Request() req: any) {
    return this.clientService.findByEmployee(req.user.id);
  }

  @Get(':id')
  @Roles('admin', 'bda')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
