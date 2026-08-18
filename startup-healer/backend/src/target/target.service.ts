import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateTargetDto, UpdateTargetDto } from './dto/target.dto';

@Injectable()
export class TargetService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async create(dto: CreateTargetDto) {
    const { data, error } = await this.supabase
      .from('targets')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new Error(`Failed to create target: ${error.message}`);
    return data;
  }

  async findMyTargets(employeeId: string) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch targets: ${error.message}`);
    return data;
  }

  async update(id: string, dto: UpdateTargetDto) {
    const { data, error } = await this.supabase
      .from('targets')
      .update(dto)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update target: ${error.message}`);
    return data;
  }

  async findByEmployee(employeeId: string) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch targets: ${error.message}`);
    return data;
  }
}
