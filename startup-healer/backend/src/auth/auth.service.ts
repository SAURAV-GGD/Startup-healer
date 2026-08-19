import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import * as bcrypt from 'bcrypt';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { LoginDto } from './dto/auth.dto';

// In-memory OTP store: email -> { otp, expiresAt, table }
interface OtpEntry {
  otp: string;
  expiresAt: number;
  table: string; // 'employees' or 'clients'
  userId: string;
}

@Injectable()
export class AuthService {
  private otpStore = new Map<string, OtpEntry>();
  private resend: Resend;
  private fromEmail: string;

  constructor(
    @Inject(SUPABASE_CLIENT) private supabase: SupabaseClient,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
  }

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
    // Email addresses are case-insensitive in normal use. Normalizing here
    // avoids rejecting a valid account because autofill added a space or
    // capitalized the address.
    const email = loginDto.email.trim().toLowerCase();
    const { password } = loginDto;

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

  // ─── Forgot Password Flow ───────────────────────────────────────────

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check employees table first, then clients
    let user: any = null;
    let table = 'employees';

    const { data: employee } = await this.supabase
      .from('employees')
      .select('id, email, name')
      .eq('email', normalizedEmail)
      .single();

    if (employee) {
      user = employee;
      table = 'employees';
    } else {
      const { data: client } = await this.supabase
        .from('clients')
        .select('id, email, name')
        .eq('email', normalizedEmail)
        .single();

      if (client) {
        user = client;
        table = 'clients';
      }
    }

    if (!user) {
      throw new BadRequestException('No account found with this email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in memory (expires in 10 minutes)
    this.otpStore.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      table,
      userId: user.id,
    });

    // Send OTP via Resend
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: normalizedEmail,
        subject: 'Startup Healer — Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #2E9E8E;">Password Reset</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Your OTP to reset your password is:</p>
            <div style="background: #f0fdf4; border: 2px solid #2E9E8E; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2E9E8E;">${otp}</span>
            </div>
            <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      this.otpStore.delete(normalizedEmail);
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, otp: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = this.otpStore.get(normalizedEmail);

    if (!entry) {
      throw new BadRequestException('No OTP found for this email. Please request a new one.');
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(normalizedEmail);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (entry.otp !== otp) {
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    // OTP is valid — generate a short-lived reset token
    const resetToken = this.jwtService.sign(
      { sub: entry.userId, email: normalizedEmail, table: entry.table, purpose: 'password-reset' },
      { expiresIn: '5m' },
    );

    // Remove used OTP
    this.otpStore.delete(normalizedEmail);

    return { message: 'OTP verified', resetToken };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(resetToken);
    } catch {
      throw new BadRequestException('Reset token is invalid or expired. Please start over.');
    }

    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('Invalid reset token.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the correct table
    const { error } = await this.supabase
      .from(payload.table)
      .update({ password: hashedPassword })
      .eq('id', payload.sub);

    if (error) {
      throw new BadRequestException('Failed to update password. Please try again.');
    }

    return { message: 'Password reset successful. You can now log in.' };
  }
}
