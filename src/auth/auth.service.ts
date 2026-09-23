import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userDto } from './dto/user.dto.js';

@Injectable()
export class AuthService {
  private readonly users = [
    { id: '1', username: 'user1', password: 'user1@123' },
    { id: '2', username: 'user2', password: 'user2@123' },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async login(payload: userDto) {
    try {
      const user = this.users.find(
        (u) =>
          u.username === payload.username && u.password === payload.password,
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
      });

      return {
        message: 'login successfully',
        access_token: token,
      };
    } catch (error) {
      throw error;
    }
  }
}
