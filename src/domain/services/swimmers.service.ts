import { BaseService } from '../../core/generic/base-service';
import { SwimmerEntity } from '../entities/swimmer-entity';
import { SwimmersRepository } from '../repositories/swimmers-repository';
import { Injectable } from '@nestjs/common';
import {
  ListSwimmersProps,
  ListSwimmersResponse,
} from '../../infra/http/dtos/ListSwimmers.dto';
import { NoCompleteInformation } from '../../core/errors/no-complete-information-error';
import { left, right } from '../../core/types/either';
import { PeriodEntity } from '../entities/PeriodEntity';
import PeriodsRepository from '../repositories/periods-repository';
import cleanContains from '../../core/utils/cleanContains';
import { SwimmerInfoResponse } from '../../infra/http/dtos/swimmers/swimmerInfo.dto';
import { Report, Swimmer } from '@prisma/client';

export type swimmerAndPeriod = Swimmer & {
  isFromThisPeriod?: boolean;
  lastReportPeriodId?: string;
} & {
  Report: Report[];
};
@Injectable()
export class SwimmersService extends BaseService<
  SwimmerEntity,
  SwimmersRepository
> {
  constructor(
    repository: SwimmersRepository,
    private readonly periodsRepository: PeriodsRepository,
  ) {
    super(repository);
  }

  async findSwimmerInfo(
    memberNumber: number,
  ): Promise<SwimmerInfoResponse | null> {
    let result = await this.repository.findSwimmerAndReports(memberNumber);

    if (!result) {
      result = await this.repository.createSwimmerFromEvoService(memberNumber);
    }

    return result;
  }

  async listByTeacherPaginated({
    page,
    perPage,
    search,
    teacherNumber,
    onlyActive,
    branchId,
    periodId,
  }: ListSwimmersProps): Promise<ListSwimmersResponse> {
    if (!teacherNumber)
      return left(new NoCompleteInformation('teacher number'));
    if (page < 1) page = 1;

    // TODO: Melhorar a performance disso aqui:
    // fazer apenas 1 requisição para a parte de swimmers
    // e não 3 kkkkkkkkkk

    let swimmers: swimmerAndPeriod[] = await this.repository.findManyByTeacher(
      teacherNumber,
      branchId,
    );

    if (onlyActive) swimmers = swimmers.filter((s) => s.isActive);

    swimmers.map((s) => {
      s.isFromThisPeriod =
        s.lastReportPeriodId && s.lastReportPeriodId === periodId;
      return s;
    });

    const swimmersWithoutReports = swimmers.filter(
      (s) => !s.isFromThisPeriod,
    ).length;

    const searchFilter = (s: swimmerAndPeriod) =>
      s.memberNumber.toString().includes(search) ||
      cleanContains({ containsThis: search, thisOne: s.name });

    const swimmersFiltered = swimmers.filter((s) => searchFilter(s));
    return right({
      swimmers: swimmersFiltered.slice((page - 1) * perPage, page * perPage),
      numberOfPages: Math.ceil(swimmersFiltered.length / perPage),
      swimmersWithoutReports,
    });
  }
}
