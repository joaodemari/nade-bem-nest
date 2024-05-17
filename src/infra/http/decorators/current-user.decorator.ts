import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPayloadDTO } from '../dtos/auth/login.dto';
import { AuthRequestDTO } from '../dtos/auth/auth-request.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPayloadDTO => {
    const request = context.switchToHttp().getRequest<AuthRequestDTO>();
    return request.user;
  },
);
