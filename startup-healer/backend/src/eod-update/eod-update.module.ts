import { Module } from '@nestjs/common';
import { EodUpdateController } from './eod-update.controller';
import { EodUpdateService } from './eod-update.service';

@Module({
  controllers: [EodUpdateController],
  providers: [EodUpdateService],
  exports: [EodUpdateService],
})
export class EodUpdateModule {}
