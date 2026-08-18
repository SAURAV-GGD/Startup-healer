import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { AuthService } from '../auth/auth.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
    private authService: AuthService,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const { data: existing } = await this.supabase
      .from('employees')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) {
      throw new ConflictException('Employee with this email already exists');
    }

    const { plain, hashed } = await this.authService.generatePassword();

    const { data: employee, error } = await this.supabase
      .from('employees')
      .insert([{ ...dto, password: hashed, role: dto.role || 'bda' }])
      .select('id, name, email, role, phone, is_active, created_at')
      .single();

    if (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }

    return { ...employee, generated_password: plain };
  }

  async findAll() {
    const { data: employees, error } = await this.supabase
      .from('employees')
      .select('id, name, email, role, phone, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }

    return employees;
  }

  async findOne(id: string) {
    const { data: employee, error } = await this.supabase
      .from('employees')
      .select('id, name, email, role, phone, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async getPerformance(employeeId: string) {
    // Fetch tasks stats
    const { data: tasks } = await this.supabase
      .from('tasks')
      .select('status')
      .eq('employee_id', employeeId);

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;

    // Fetch targets
    const { data: targets } = await this.supabase
      .from('targets')
      .select('*')
      .eq('employee_id', employeeId);

    // Fetch assigned clients count
    const { data: clients } = await this.supabase
      .from('clients')
      .select('id')
      .eq('assigned_employee_id', employeeId)
      .eq('is_active', true);

    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      targets: targets || [],
      assignedClients: clients?.length || 0,
    };
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const { data: employee, error } = await this.supabase
      .from('employees')
      .update(dto)
      .eq('id', id)
      .select('id, name, email, role, phone, is_active, created_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }

    return employee;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('employees')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }

    return { message: 'Employee deleted successfully' };
  }

  async getCount() {
    const { data } = await this.supabase
      .from('employees')
      .select('id')
      .eq('is_active', true);

    return data?.length || 0;
  }
}
