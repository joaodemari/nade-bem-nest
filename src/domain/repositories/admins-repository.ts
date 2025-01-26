import { Admin } from '@prisma/client';

export abstract class AdminsRepository {
  abstract findByAuthId(authId: string): Promise<Admin | null>;
}
