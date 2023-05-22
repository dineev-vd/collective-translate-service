import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'entities/user.entity';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: `10m` }),
    };
  }

  async register(user) {
    return this.usersService.createUser(user);
  }

  getRefreshToken(userId: string) {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: `7d`,
    });

    return token;
  }
}
