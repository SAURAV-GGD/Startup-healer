import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

@Injectable()
export class SalarySlipService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async upload(employeeId: string, month: number, year: number, fileUrl: string, fileName: string) {
    const { data, error } = await this.supabase
      .from('salary_slips')
      .upsert([{
        employee_id: employeeId,
        month,
        year,
        file_url: fileUrl,
        file_name: fileName,
      }], { onConflict: 'employee_id,month,year' })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to upload salary slip: ${error.message}`);
    return data;
  }

  async findMy(employeeId: string) {
    const { data, error } = await this.supabase
      .from('salary_slips')
      .select('*')
      .eq('employee_id', employeeId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw new Error(`Failed to fetch salary slips: ${error.message}`);
    return data;
  }

  async findByEmployee(employeeId: string) {
    return this.findMy(employeeId);
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('salary_slips')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw new Error(`Failed to fetch salary slips: ${error.message}`);
    return data;
  }
}
