import { Enterprise } from '@prisma/client';

export abstract class EnterpriseRepository {
  abstract findById(id: string): Promise<Enterprise | null>;
}
