import { Auth } from '@prisma/client';

export abstract class AuthRepository {
  abstract findByEmail(
    email: string,
  ): Promise<{ auth: Auth; memberNumber: number | null; branchId: string }>;
}
