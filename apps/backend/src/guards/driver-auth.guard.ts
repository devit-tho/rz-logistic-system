import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DriverAuthGuard extends AuthGuard('driver-jwt') {}
