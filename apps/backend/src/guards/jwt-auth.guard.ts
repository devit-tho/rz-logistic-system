import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// ----------------------------------------------------------------------

const PUBLIC_ROUTE = 'PUBLIC_ROUTE';
const IsPublic = (reflector: Reflector, context: ExecutionContext) =>
  reflector.getAllAndOverride(PUBLIC_ROUTE, [
    context.getHandler(),
    context.getClass(),
  ]);
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('user-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = IsPublic(this.reflector, context);
    if (isPublic) return true;

    return super.canActivate(context);
  }
}
