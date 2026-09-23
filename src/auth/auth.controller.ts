import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { userDto } from './dto/user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: userDto) {
    return this.authService.login(payload);
  }
}
