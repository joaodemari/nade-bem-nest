import PeriodsRepository from '../../../../domain/repositories/periods-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Period, Prisma } from '@prisma/client';

@Injectable()
export class PrismaPeriodsRepository implements PeriodsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(period: Prisma.PeriodCreateInput): Promise<void> {
    await this.prisma.period.create({
      data: period,
    });
  }

  async findActualPeriod(branchId: string): Promise<Period | null> {
    const period = await this.prisma.period.findFirst({
      where: {
        branchId,
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

    return period;
  }

  async findPeriods(branchId: string): Promise<Period[]> {
    return await this.prisma.period.findMany({
      where: {
        branchId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
