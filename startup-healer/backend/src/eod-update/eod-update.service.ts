import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateEodUpdateDto } from './dto/eod-update.dto';

@Injectable()
export class EodUpdateService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async create(dto: CreateEodUpdateDto, employeeId: string) {
    const date = dto.date || new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from('eod_updates')
      .upsert([{ ...dto, date, employee_id: employeeId }], { onConflict: 'employee_id,date' })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to submit EOD: ${error.message}`);
    return data;
  }

  async findMy(employeeId: string) {
    const { data, error } = await this.supabase
      .from('eod_updates')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw new Error(`Failed to fetch EOD updates: ${error.message}`);
    return data;
  }

  async findByEmployee(employeeId: string) {
    const { data, error } = await this.supabase
      .from('eod_updates')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw new Error(`Failed to fetch EOD updates: ${error.message}`);
    return data;
  }
}
