import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
    private jwtService: JwtService,
  ) {}

  async adminLogin(loginDto: LoginDto) {
    return this.login(loginDto, 'employees', 'admin');
  }

  async employeeLogin(loginDto: LoginDto) {
    return this.login(loginDto, 'employees', 'bda');
  }

  async clientLogin(loginDto: LoginDto) {
    return this.login(loginDto, 'clients', null);
  }

  private async login(loginDto: LoginDto, table: string, requiredRole: string | null) {
    const { email, password } = loginDto;

    const { data: user, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For employees, check role (admin vs bda)
    if (table === 'employees' && requiredRole === 'admin' && user.role !== 'admin') {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Determine role for JWT
    let role: string;
    if (table === 'clients') {
      role = 'client';
    } else {
      role = user.role; // 'admin' or 'bda'
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        ...(table === 'clients' && { company_name: user.company_name }),
      },
      access_token: token,
    };
  }

  async validateUser(userId: string, role: string) {
    const table = role === 'client' ? 'clients' : 'employees';
    const { data: user } = await this.supabase
      .from(table)
      .select('id, name, email')
      .eq('id', userId)
      .single();

    return user;
  }

  async generatePassword(): Promise<{ plain: string; hashed: string }> {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let plain = '';
    for (let i = 0; i < 10; i++) {
      plain += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const hashed = await bcrypt.hash(plain, 10);
    return { plain, hashed };
  }
}
