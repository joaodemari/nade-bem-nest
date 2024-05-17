import { BaseService } from 'src/core/generic/base-service';
import { SwimmerEntity } from '../entities/swimmer-entity';
import { SwimmersRepository } from '../repositories/swimmers-repository';
import { Injectable } from '@nestjs/common';
import {
  ListSwimmersProps,
  ListSwimmersResponse,
} from 'src/infra/http/dtos/ListSwimmers.dto';
import { NoCompleteInformation } from 'src/core/errors/no-complete-information-error';
import { left, right } from 'src/core/types/either';
import { PeriodEntity } from '../entities/PeriodEntity';
import PeriodsRepository from '../repositories/periods-repository';
import cleanContains from 'src/core/utils/cleanContains';

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

  async listByTeacherPaginated({
    page,
    perPage,
    search,
    teacherNumber,
  }: ListSwimmersProps): Promise<ListSwimmersResponse> {
    if (!teacherNumber)
      return left(new NoCompleteInformation('teacher number'));
    if (page < 1) page = 1;

    // TODO: Melhorar a performance disso aqui:
    // fazer apenas 1 requisição para a parte de swimmers
    // e não 3 kkkkkkkkkk
    const [swimmers, period]: [SwimmerEntity[], PeriodEntity] =
      await Promise.all([
        this.repository.findManyByTeacher(teacherNumber),
        this.periodsRepository.findActualPeriod(),
      ]);

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
