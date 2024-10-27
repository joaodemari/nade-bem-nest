import { Period, Prisma } from '@prisma/client';

abstract class PeriodsRepository {
  abstract create(period: Prisma.PeriodCreateInput): Promise<void>;
  abstract findActualPeriod(branchId: string): Promise<Period | null>;
  abstract findPeriods(branchId: string): Promise<Period[]>;
}

export default PeriodsRepository;
