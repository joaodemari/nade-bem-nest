import { IRepository } from '../../core/generic/I-repository';
import { PeriodEntity } from '../entities/PeriodEntity';

abstract class PeriodsRepository extends IRepository<PeriodEntity> {
  abstract create(period: PeriodEntity): Promise<void>;
  abstract findActualPeriod(): Promise<PeriodEntity | null>;
}

export default PeriodsRepository;
