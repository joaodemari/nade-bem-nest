import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthDTO extends createZodDto(authSchema) {}

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  metadata: z
    .object({
      token: z.string(),
      name: z.string(),
      email: z.string(),
      memberNumber: z.number(),
      branchId: z.string(),
      role: z.string(),
      authId: z.string(),
    })
    .optional(),
});

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}

export const AuthPayloadSchema = z.object({
  memberNumber: z.number(),
  email: z.string(),
  role: z.string(),
  branchId: z.string(),
  name: z.string(),
  authId: z.string(),
});

export class AuthPayloadDTO extends createZodDto(AuthPayloadSchema) {}
