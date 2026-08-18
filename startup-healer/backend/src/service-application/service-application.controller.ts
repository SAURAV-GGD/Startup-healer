import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ServiceApplicationService } from './service-application.service';
import { CreateServiceApplicationDto, UpdateServiceStatusDto } from './dto/service-application.dto';

@Controller('service-applications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ServiceApplicationController {
  constructor(private readonly serviceApplicationService: ServiceApplicationService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateServiceApplicationDto) {
    return this.serviceApplicationService.create(dto);
  }

  @Get('my')
  @Roles('client')
  findMy(@Request() req: any) {
    return this.serviceApplicationService.findMy(req.user.id);
  }

  @Get('client/:clientId')
  @Roles('admin', 'bda')
  findByClient(@Param('clientId') clientId: string) {
    return this.serviceApplicationService.findByClient(clientId);
  }

  @Get(':id')
  @Roles('admin', 'bda', 'client')
  findOne(@Param('id') id: string) {
    return this.serviceApplicationService.findOne(id);
  }

  @Put(':id/status')
  @Roles('admin', 'bda')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateServiceStatusDto) {
    return this.serviceApplicationService.updateStatus(id, dto);
  }

  @Put(':id/documents')
  @Roles('client')
  uploadDocument(@Param('id') id: string, @Body('documents') documents: any[]) {
    return this.serviceApplicationService.uploadDocument(id, documents);
  }

  @Put(':id/certificate')
  @Roles('admin')
  setCertificate(@Param('id') id: string, @Body('certificate_url') certificateUrl: string) {
    return this.serviceApplicationService.setCertificate(id, certificateUrl);
  }
}
