import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskModule } from './task/task.module';
import { TargetModule } from './target/target.module';
import { EodUpdateModule } from './eod-update/eod-update.module';
import { ServiceApplicationModule } from './service-application/service-application.module';
import { SalarySlipModule } from './salary-slip/salary-slip.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    SupabaseModule,
    AuthModule,
    ClientModule,
    EmployeeModule,
    TaskModule,
    TargetModule,
    EodUpdateModule,
    ServiceApplicationModule,
    SalarySlipModule,
    LeaveRequestModule,
    AttendanceModule,
  ],
})
export class AppModule {}
