import { Injectable } from '@nestjs/common';
import PeriodsRepository from '../../repositories/periods-repository';

@Injectable()
export class PeriodService {
  constructor(private readonly repository: PeriodsRepository) {}

  async findAllByBranch(branchId: string) {
    const periods = await this.repository.findPeriods(branchId);
    return periods;
  }
}
