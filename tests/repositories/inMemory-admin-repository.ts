import { Admin } from '@prisma/client';
import { AdminsRepository } from '../../src/domain/repositories/admins-repository';

export class InMemoryAdminRepository implements AdminsRepository {
  constructor() {}

  admins: Admin[] = [];

  async findByAuthId(authId: string): Promise<Admin | null> {
    const admin = this.admins.find((a) => a.authId === authId);

    return admin;
  }
}
