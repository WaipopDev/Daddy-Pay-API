import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): number => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request['userId'];
});
