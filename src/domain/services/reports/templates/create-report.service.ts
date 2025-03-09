import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';
import { Prisma, Report } from '@prisma/client';
import { LevelsRepository } from '../../../repositories/levels-repository';
import { SwimmersRepository } from '../../../repositories/swimmers-repository';
import { ReportsRepository } from '../../../repositories/reports-repository';

@Injectable()
export class CreateReportService {
  constructor(
    private readonly levelRepository: LevelsRepository,
    private readonly swimmersRepository: SwimmersRepository,
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async handle({
    stepIds,
    observation,
    selectionId,
    levelId,
  }: {
    stepIds: string[];
    observation: string;
    selectionId: string;
    levelId: string;
  }): Promise<Report> {
    try {
      const level =
        await this.levelRepository.findLevelAndAreasAndStepsByLevelId(levelId);

      const approved = this.checkIfIsApproved(level, stepIds);

      let data: Prisma.ReportCreateInput = {
        approved,
        ReportAndSteps: {
          create: stepIds.map((stepId) => {
            return {
              step: {
                connect: {
                  id: stepId,
                },
              },
            };
          }),
        },
        level: {
          connect: {
            id: levelId,
          },
        },
        observation,
        swimmerTeacherPeriodSelection: {
          connect: {
            id: selectionId,
          },
        },
      };
      let report: Report;

      await this.reportsRepository.create(data);
      await this.swimmersRepository.updateLevelAndReport({
        levelId,
        swimmerSelectionId: selectionId,
      });
      return report;
    } catch (e) {
      console.log('Erro: ', e);
      return e;
    }
  }

  private checkIfIsApproved(
    level: {
      areas: ({
        steps: {
          id: string;
          description: string;
          points: number;
          areaId: string;
        }[];
      } & { id: string; title: string; levelId: string | null })[];
    } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string | null;
    },
    stepIds: string[],
  ) {
    return level.areas.every((area) => {
      const selectedStep = area.steps.filter((step) =>
        stepIds.some((stepId) => stepId === step.id),
      );
      if (selectedStep.length != 1) throw new Error('Invalid report');
      return selectedStep[0] && selectedStep[0].points === 3;
    });
  }
}

export type UpdateLevelAndReportProps = {
  swimmerSelectionId: string;
  levelId: string;
};

// if (id !== 'new') {
//   report = await this.reportsRepository.updateReportById(data, id);
//   if (!report) throw new Error('Report not found');
// }
