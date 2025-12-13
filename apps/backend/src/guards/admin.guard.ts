import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

const ADMIN_ROUTE = 'ADMIN_ROUTE';
export const UseAdmin = () => SetMetadata(ADMIN_ROUTE, true);

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const meta = this.reflector.getAllAndOverride<boolean>(ADMIN_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (meta) return true;

    const request = context.switchToHttp().getRequest<Request>();
    return request.user?.isSuperAdmin;
  }
}
