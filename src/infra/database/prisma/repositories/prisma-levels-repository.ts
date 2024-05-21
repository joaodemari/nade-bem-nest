import { LevelsRepository } from '../../../../domain/repositories/levels-repository';
import { PrismaService } from '../prisma.service';

export class PrismaLevelsRepository extends LevelsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findLevelAndAreasAndSteps(levelId: string) {
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

  findByLevelNumber(levelNumber: number): Promise<
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
