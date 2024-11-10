import { Admin } from '@prisma/client';

export interface AdminsRepository {
  findByAuthId(authId: string): Promise<Admin | null>;
}
