import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async create(dto: CreateTaskDto) {
    const { data: task, error } = await this.supabase
      .from('tasks')
      .insert([dto])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return task;
  }

  async findAll() {
    const { data: tasks, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return tasks;
  }

  async findMyTasks(employeeId: string) {
    const { data: tasks, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('employee_id', employeeId)
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return tasks;
  }

  async findTodayTasks(employeeId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data: tasks, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('due_date', today)
      .order('priority', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return tasks;
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto, employeeId: string) {
    const { data: task, error } = await this.supabase
      .from('tasks')
      .update({ status: dto.status })
      .eq('id', id)
      .eq('employee_id', employeeId)
      .select('*')
      .single();

    if (error || !task) {
      throw new NotFoundException('Task not found or not assigned to you');
    }

    return task;
  }

  async getTasksDueToday() {
    const today = new Date().toISOString().split('T')[0];
    const { data: tasks } = await this.supabase
      .from('tasks')
      .select('id')
      .eq('due_date', today)
      .neq('status', 'completed');

    return tasks?.length || 0;
  }

  async getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    const { data: tasks } = await this.supabase
      .from('tasks')
      .select('id')
      .lt('due_date', today)
      .neq('status', 'completed');

    return tasks?.length || 0;
  }

  async findByEmployee(employeeId: string) {
    const { data: tasks, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return tasks;
  }
}
