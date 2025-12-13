import { UserWithoutPassword } from '@monorepo/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserWithoutPassword => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user;
  },
);

export const GetToken = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.token;
  },
);
