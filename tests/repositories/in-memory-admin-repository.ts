import { Admin } from '@prisma/client';
import { AdminsRepository } from '../../src/domain/repositories/admins-repository';
import { adminsDummyDB } from './dummyDB';

export class InMemoryAdminRepository implements AdminsRepository {
  constructor() {}

  admins: Admin[] = adminsDummyDB;

  async findByAuthId(authId: string): Promise<Admin | null> {
    const admin = this.admins.find((a) => a.authId === authId);

    return admin;
  }
}
