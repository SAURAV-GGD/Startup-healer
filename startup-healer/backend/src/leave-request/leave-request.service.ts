import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto/leave-request.dto';

@Injectable()
export class LeaveRequestService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async create(dto: CreateLeaveRequestDto, employeeId: string) {
    const { data, error } = await this.supabase
      .from('leave_requests')
      .insert([{ ...dto, employee_id: employeeId }])
      .select('*')
      .single();

    if (error) throw new Error(`Failed to create leave request: ${error.message}`);
    return data;
  }

  async findMy(employeeId: string) {
    const { data, error } = await this.supabase
      .from('leave_requests')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch leave requests: ${error.message}`);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch leave requests: ${error.message}`);
    return data;
  }

  async findPending() {
    const { data, error } = await this.supabase
      .from('leave_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch leave requests: ${error.message}`);
    return data;
  }

  async updateStatus(id: string, dto: UpdateLeaveStatusDto) {
    const { data, error } = await this.supabase
      .from('leave_requests')
      .update({ status: dto.status, admin_remark: dto.admin_remark })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update leave request: ${error.message}`);

    // If approved, mark attendance as on_leave for those dates
    if (dto.status === 'approved' && data) {
      await this.markLeaveDates(data.employee_id, data.from_date, data.to_date);
    }

    return data;
  }

  private async markLeaveDates(employeeId: string, fromDate: string, toDate: string) {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const records = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      records.push({
        employee_id: employeeId,
        date: d.toISOString().split('T')[0],
        status: 'on_leave',
      });
    }

    if (records.length > 0) {
      await this.supabase
        .from('attendance')
        .upsert(records, { onConflict: 'employee_id,date' });
    }
  }
}
