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
  }: ListSwimmersProps): Promise<ListSwimmersResponse> {
    if (!teacherNumber)
      return left(new NoCompleteInformation('teacher number'));
    if (page < 1) page = 1;

    // TODO: Melhorar a performance disso aqui:
    // fazer apenas 1 requisição para a parte de swimmers
    // e não 3 kkkkkkkkkk
    let [swimmers, period]: [SwimmerEntity[], PeriodEntity] = await Promise.all(
      [
        this.repository.findManyByTeacher(teacherNumber),
        this.periodsRepository.findActualPeriod(),
      ],
    );

    console.log('onlyActive', onlyActive);
    if (onlyActive) swimmers = swimmers.filter((s) => s.isActive);

    const swimmersWithoutReports = swimmers.filter(
      (s) => !s.lastReport || new Date(s.lastReport) < period.startDate,
    ).length;

    const searchNumber = Number(search);

    const searchFilter = (s: SwimmerEntity) =>
      s.memberNumber.toString().includes(searchNumber.toString()) ||
      cleanContains({ containsThis: search, thisOne: s.name });

    const swimmersFiltered = swimmers.filter((s) => searchFilter(s));
    return right({
      swimmers: swimmersFiltered.slice((page - 1) * perPage, page * perPage),
      numberOfPages: Math.ceil(swimmersFiltered.length / perPage),
      swimmersWithoutReports,
      period,
    });
  }
}
