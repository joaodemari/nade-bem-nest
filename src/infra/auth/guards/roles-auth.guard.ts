import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../domain/enums/role.enum';
import { PROFILE_KEY } from '../../../infra/http/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredProfile = this.reflector.getAllAndOverride<Role[]>(
      PROFILE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredProfile) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredProfile.some((role) => user.role?.includes(role));
  }
}
