import { PeriodEntity } from 'src/domain/entities/PeriodEntity';
import { PrismaPeriodsMapper } from '../mappers/prisma-period-mapper';
import PeriodsRepository from 'src/domain/repositories/periods-repository';
import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from './prisma-base-repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPeriodsRepository
  extends PrismaBaseRepository<PeriodEntity>
  implements PeriodsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'period');
  }

  async create(period: PeriodEntity): Promise<void> {
    await this.prisma.period.create({
      data: PrismaPeriodsMapper.toPersistence(period),
    });
  }

  async findActualPeriod(): Promise<PeriodEntity | null> {
    const period = await this.prisma.period.findFirst({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (!period) {
      return null;
    }

    return PrismaPeriodsMapper.toDomain(period);
  }
}
