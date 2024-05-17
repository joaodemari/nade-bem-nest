import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/domain/enums/role.enum';

export const PROFILE_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(PROFILE_KEY, roles);
