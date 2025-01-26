import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LevelsRepository } from '../../../../domain/repositories/levels-repository';
import { PrismaService } from '../prisma.service';
import { Area, Level, Step } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaLevelsRepository implements LevelsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }

  async findLevelById(levelId: string): Promise<
    Level & {
      areas: (Area & { steps: Step[] })[];
    }
  > {
    return await this.prisma.level.findFirst({
      where: { id: levelId },
      include: { areas: { include: { steps: true } } },
    });
  }

  async findLevelAndAreasAndStepsByLevelId(levelId: string) {
    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
      include: {
        areas: { include: { steps: { orderBy: { points: 'asc' } } } },
      },
    });

    return level;
  }

  async findFirstLevel(): Promise<
    {
      areas: ({
        steps: {
          id: string;
          description: string;
          points: number;
          areaId: string;
        }[];
      } & { id: string; title: string; levelId: string })[];
    } & { id: string; name: string; levelNumber: number; branchId: string }
  > {
    const firstLevel = await this.prisma.level.findFirst({
      where: { levelNumber: 1 },
      include: {
        areas: { include: { steps: { orderBy: { points: 'asc' } } } },
      },
    });

    return firstLevel;
  }

  findLevelAndAreasAndStepsByLevelNumber(levelNumber: number): Promise<
    {
      areas: ({
        steps: {
          id: string;
          description: string;
          points: number;
          areaId: string;
        }[];
      } & { id: string; title: string; levelId: string })[];
    } & { id: string; name: string; levelNumber: number; branchId: string }
  > {
    const level = this.prisma.level.findFirst({
      where: { levelNumber },
      include: {
        areas: { include: { steps: { orderBy: { points: 'asc' } } } },
      },
    });

    return level;
  }
}
