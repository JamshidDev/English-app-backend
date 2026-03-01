import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentClient } from '@shared/types';

export const GetCurrentClient = createParamDecorator(
  (data: keyof CurrentClient | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const client = request.user as CurrentClient;
    return data ? client?.[data] : client;
  },
);
