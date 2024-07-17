import { z } from 'zod';

export enum Role {
  teacher = 'teacher',
  swimmer = 'swimmer',
  admin = 'admin',
}

export const RoleZodEnum = z.enum([Role.teacher, Role.swimmer]);
