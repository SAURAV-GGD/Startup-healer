import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

@Injectable()
export class AttendanceService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async checkIn(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in
    const { data: existing } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    if (existing && existing.check_in) {
      throw new ConflictException('Already checked in today');
    }

    if (existing && existing.status === 'on_leave') {
      throw new ConflictException('You are on approved leave today');
    }

    const { data, error } = await this.supabase
      .from('attendance')
      .upsert([{
        employee_id: employeeId,
        date: today,
        status: 'present',
        check_in: new Date().toISOString(),
      }], { onConflict: 'employee_id,date' })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to check in: ${error.message}`);
    return data;
  }

  async checkOut(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('attendance')
      .update({ check_out: new Date().toISOString() })
      .eq('employee_id', employeeId)
      .eq('date', today)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to check out: ${error.message}`);
    return data;
  }

  async getMyAttendance(employeeId: string, month?: number, year?: number) {
    const now = new Date();
    const m = month || now.getMonth() + 1;
    const y = year || now.getFullYear();
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const endDate = `${y}-${String(m).padStart(2, '0')}-31`;

    const { data, error } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw new Error(`Failed to fetch attendance: ${error.message}`);
    return data;
  }

  async getEmployeeAttendance(employeeId: string, month?: number, year?: number) {
    return this.getMyAttendance(employeeId, month, year);
  }

  async getTeamSummary(month?: number, year?: number) {
    const now = new Date();
    const m = month || now.getMonth() + 1;
    const y = year || now.getFullYear();
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const endDate = `${y}-${String(m).padStart(2, '0')}-31`;

    // Get all employees
    const { data: employees } = await this.supabase
      .from('employees')
      .select('id, name, email')
      .eq('is_active', true);

    // Get all attendance for the month
    const { data: attendance } = await this.supabase
      .from('attendance')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    const summary = (employees || []).map(emp => {
      const empAttendance = (attendance || []).filter(a => a.employee_id === emp.id);
      return {
        employee: emp,
        present: empAttendance.filter(a => a.status === 'present').length,
        absent: empAttendance.filter(a => a.status === 'absent').length,
        on_leave: empAttendance.filter(a => a.status === 'on_leave').length,
        total: empAttendance.length,
      };
    });

    return summary;
  }

  async getTodayStatus(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    return data || { status: 'not_marked', check_in: null, check_out: null };
  }
}
