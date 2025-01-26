import { Injectable } from '@nestjs/common';
import { Period, Prisma } from '@prisma/client';
import PeriodsRepository from '../../src/domain/repositories/periods-repository';

@Injectable()
export class InMemoryPeriodsRepository implements PeriodsRepository {
  constructor() {}
  create(period: Prisma.PeriodCreateInput): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findActualPeriod(branchId: string): Promise<Period | null> {
    throw new Error('Method not implemented.');
  }
  findPeriods(branchId: string): Promise<Period[]> {
    throw new Error('Method not implemented.');
  }
}
