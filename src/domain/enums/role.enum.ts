import { z } from 'zod';

export enum Role {
  Teacher = 'teacher',
  Admin = 'admin',
  Responsible = 'responsible',
}

export const RoleZodEnum = z.enum([Role.Teacher, Role.Responsible, Role.Admin]);
