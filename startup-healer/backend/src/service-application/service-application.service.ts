import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateServiceApplicationDto, UpdateServiceStatusDto } from './dto/service-application.dto';

@Injectable()
export class ServiceApplicationService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  async create(dto: CreateServiceApplicationDto) {
    const { data, error } = await this.supabase
      .from('service_applications')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new Error(`Failed to create service application: ${error.message}`);
    return data;
  }

  async findByClient(clientId: string) {
    const { data, error } = await this.supabase
      .from('service_applications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch service applications: ${error.message}`);
    return data;
  }

  async findMy(clientId: string) {
    return this.findByClient(clientId);
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('service_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Service application not found');
    return data;
  }

  async updateStatus(id: string, dto: UpdateServiceStatusDto) {
    const { data, error } = await this.supabase
      .from('service_applications')
      .update({ status: dto.status, admin_remark: dto.admin_remark, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to update status: ${error.message}`);
    return data;
  }

  async uploadDocument(id: string, documents: any[]) {
    const { data: existing } = await this.supabase
      .from('service_applications')
      .select('documents')
      .eq('id', id)
      .single();

    const currentDocs = existing?.documents || [];
    const updatedDocs = [...currentDocs, ...documents];

    const { data, error } = await this.supabase
      .from('service_applications')
      .update({ documents: updatedDocs })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to upload document: ${error.message}`);
    return data;
  }

  async setCertificate(id: string, certificateUrl: string) {
    const { data, error } = await this.supabase
      .from('service_applications')
      .update({ certificate_url: certificateUrl })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(`Failed to set certificate: ${error.message}`);
    return data;
  }
}
