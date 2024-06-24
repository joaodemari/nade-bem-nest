import { Period } from '@prisma/client';
import { IRepository } from '../../core/generic/I-repository';
import { PeriodEntity } from '../entities/PeriodEntity';

abstract class PeriodsRepository extends IRepository<PeriodEntity> {
  abstract create(period: PeriodEntity): Promise<void>;
  abstract findActualPeriod(branchId: string): Promise<PeriodEntity | null>;
  abstract findPeriods(branchId: string): Promise<Period[]>;
}

export default PeriodsRepository;
