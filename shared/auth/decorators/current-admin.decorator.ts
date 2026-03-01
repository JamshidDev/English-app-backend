import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentAdmin } from '../../types';

export const GetCurrentAdmin = createParamDecorator(
  (data: keyof CurrentAdmin | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const admin = request.user as CurrentAdmin;
    return data ? admin?.[data] : admin;
  },
);
