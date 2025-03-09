import { Enterprise } from '@prisma/client';

import { EnterpriseRepository } from '../../src/domain/repositories/enterprise-repository';
import { enterprisesDummyDB } from './dummyDB';

export class InMemoryEnterpriseRepository implements EnterpriseRepository {
  enterprises: Enterprise[] = enterprisesDummyDB;

  constructor() {}

  async findById(id: string): Promise<Enterprise | null> {
    return enterprisesDummyDB.find((enterprise) => enterprise.id === id);
  }
}
