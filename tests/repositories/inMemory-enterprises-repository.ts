import { Enterprise } from '@prisma/client';

export interface EnterpriseRepository {
  findByAdminId(authId: string): Promise<Enterprise | null>;
}
