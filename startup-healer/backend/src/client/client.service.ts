import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { AuthService } from '../auth/auth.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
    private authService: AuthService,
  ) {}

  async create(dto: CreateClientDto) {
    // Check if email already exists
    const { data: existing } = await this.supabase
      .from('clients')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new ConflictException('Client with this email already exists');
    }

    // Auto-generate password
    const { plain, hashed } = await this.authService.generatePassword();

    const { data: client, error } = await this.supabase
      .from('clients')
      .insert([{ ...dto, password: hashed }])
      .select('id, name, company_name, email, phone, assigned_employee_id, status, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return { ...client, generated_password: plain };
  }

  async findAll(search?: string, status?: string) {
    let query = this.supabase
      .from('clients')
      .select('id, name, company_name, email, phone, assigned_employee_id, status, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: clients, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return clients;
  }

  async findOne(id: string) {
    const { data: client, error } = await this.supabase
      .from('clients')
      .select('id, name, company_name, email, phone, assigned_employee_id, status, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async findByEmployee(employeeId: string) {
    const { data: clients, error } = await this.supabase
      .from('clients')
      .select('id, name, company_name, email, phone, status, created_at')
      .eq('assigned_employee_id', employeeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return clients;
  }

  async findOwnProfile(clientId: string) {
    const { data: client, error } = await this.supabase
      .from('clients')
      .select('id, name, company_name, email, phone, status, created_at, updated_at')
      .eq('id', clientId)
      .single();

    if (error || !client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, dto: UpdateClientDto) {
    const { data: client, error } = await this.supabase
      .from('clients')
      .update(dto)
      .eq('id', id)
      .select('id, name, company_name, email, phone, assigned_employee_id, status, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }

    return client;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('clients')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }

    return { message: 'Client deleted successfully' };
  }

  async getStats() {
    const { data: clients } = await this.supabase
      .from('clients')
      .select('status')
      .eq('is_active', true);

    const total = clients?.length || 0;
    const active = clients?.filter(c => c.status === 'active').length || 0;
    const pending = clients?.filter(c => c.status === 'pending').length || 0;
    const completed = clients?.filter(c => c.status === 'completed').length || 0;

    return { total, active, pending, completed };
  }
}
