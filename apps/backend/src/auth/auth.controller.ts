import { GetToken, GetUser } from '@/decorators';
import { PublicRoute } from '@/guards/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import { loginSchema, LoginSchema } from '@monorepo/schemas';
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

// ----------------------------------------------------------------------

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicRoute()
  @Throttle({ default: { ttl: 60, limit: 5 } })
  async login(@Body(new ZodValidationPipe(loginSchema)) data: LoginSchema) {
    return this.authService.login(data);
  }

  @Get('current-user')
  async getCurrentUser(@GetUser() user: UserWithoutPassword) {
    return user;
  }

  @Delete('logout')
  async logout(@GetToken() token: string) {
    return this.authService.logout(token);
  }
}
