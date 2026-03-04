import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMessagePattern } from '@luckyplans/shared';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthMessagePattern.LOGIN)
  async login(@Payload() data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern(AuthMessagePattern.REGISTER)
  async register(@Payload() data: { email: string; password: string; name: string }) {
    return this.authService.register(data.email, data.password, data.name);
  }

  @MessagePattern(AuthMessagePattern.VALIDATE)
  async validate(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }

  @MessagePattern(AuthMessagePattern.PROFILE)
  async getProfile(@Payload() data: { userId: string }) {
    return this.authService.getProfile(data.userId);
  }
}
