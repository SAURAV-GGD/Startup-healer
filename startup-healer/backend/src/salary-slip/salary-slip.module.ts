import { Module } from '@nestjs/common';
import { SalarySlipController } from './salary-slip.controller';
import { SalarySlipService } from './salary-slip.service';

@Module({
  controllers: [SalarySlipController],
  providers: [SalarySlipService],
  exports: [SalarySlipService],
})
export class SalarySlipModule {}
