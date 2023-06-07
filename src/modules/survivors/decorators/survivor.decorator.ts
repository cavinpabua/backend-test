import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthSurvivorType } from '../models/auth-survivor.model';

export const AuthSurvivor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthSurvivorType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
