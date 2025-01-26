import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthRepository } from '../../../../domain/repositories/auth-repository';
import { Auth } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';
import {
  GetVisitsByRangeProps,
  SessionsRepository,
} from '../../../../domain/repositories/sessions-repository';

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }
  async getVisitsByRange(
    props: GetVisitsByRangeProps,
  ): Promise<{ visits: number }> {
    return await this.prisma.session
      .aggregate({
        where: {
          AND: [
            {
              createdAt: {
                gte: props.start,
              },
            },
            {
              createdAt: {
                lte: props.end,
              },
            },
            {
              auth: {
                role: props.role,
              },
            },
            {
              auth: {
                Responsible: {
                  branchId: { equals: props.branchId },
                },
              },
            },
          ],
        },
        _count: {
          id: true,
        },
      })
      .then((res) => {
        return {
          visits: res._count.id,
        };
      });
  }
}
