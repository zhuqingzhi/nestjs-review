import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const userInfoDecorator = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest();
    return key ? request.user[key] : request.user;
  },
);
