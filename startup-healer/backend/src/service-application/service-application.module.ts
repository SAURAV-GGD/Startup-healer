import { Module } from '@nestjs/common';
import { ServiceApplicationController } from './service-application.controller';
import { ServiceApplicationService } from './service-application.service';

@Module({
  controllers: [ServiceApplicationController],
  providers: [ServiceApplicationService],
  exports: [ServiceApplicationService],
})
export class ServiceApplicationModule {}
