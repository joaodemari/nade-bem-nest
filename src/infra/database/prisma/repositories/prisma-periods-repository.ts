import PeriodsRepository from '../../../../domain/repositories/periods-repository';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Period, Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaPeriodsRepository implements PeriodsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }

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
