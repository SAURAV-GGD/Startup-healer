import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('employee/login')
  async employeeLogin(@Body() loginDto: LoginDto) {
    return this.authService.employeeLogin(loginDto);
  }

  @Post('client/login')
  async clientLogin(@Body() loginDto: LoginDto) {
    return this.authService.clientLogin(loginDto);
  }
}
