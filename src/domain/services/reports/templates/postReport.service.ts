import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';
import { Prisma, Report } from '@prisma/client';
import { LevelsRepository } from '../../../repositories/levels-repository';
import { SwimmersRepository } from '../../../repositories/swimmers-repository';
import { ReportsRepository } from '../../../repositories/reports-repository';

@Injectable()
export class PostReportService {
  constructor(
    private readonly levelRepository: LevelsRepository,
    private readonly swimmersRepository: SwimmersRepository,
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async handle(props: {
    levelId: string;
    steps: string[];
    observation: string;
    memberNumber: number;
    id: string;
    periodId: string;
  }): Promise<Report> {
    try {
      const { periodId, levelId, steps, observation, memberNumber, id } = props;
      const levelOfReport =
        await this.levelRepository.findLevelAndAreasAndStepsByLevelId(levelId);

      const approved = steps.every((stepId) => {
        const step = levelOfReport?.areas
          .find((area) => area.steps.some((s) => s.id === stepId))
          ?.steps.find((s) => s.id === stepId);
        return step?.points === 3;
      });

      if (!levelOfReport) throw new Error('Level not found');

      const swimmer =
        await this.swimmersRepository.findByMemberNumber(memberNumber);

      let data: Prisma.ReportCreateInput = {
        approved,
        ReportAndSteps: {
          create: steps.map((id) => {
            return {
              step: {
                connect: {
                  id,
                },
              },
            };
          }),
        },
        level: { connect: { id: levelId } },
        observation,
        swimmer: { connect: { memberNumber } },
        Period: { connect: { id: periodId } },
        teacher: { connect: { id: swimmer.teacherId } },
      };
      let report: Report;

      if (id !== 'new') {
        report = await this.reportsRepository.updateReportById(data, id);
        if (!report) throw new Error('Report not found');
      } else {
        if (approved && levelOfReport.levelNumber < 5) {
          const nextLevel =
            await this.levelRepository.findLevelAndAreasAndStepsByLevelNumber(
              levelOfReport.levelNumber + 1,
            );

          if (!nextLevel) throw new Error('Next level not found');

          data = {
            ...data,
            level: { connect: { id: nextLevel.id } },
          };
        }

        report = await this.reportsRepository.create(data);
      }
      await this.swimmersRepository.updateLevelAndReport({
        memberNumber,
        levelId,
        reportId: report.id,
      });
      return report;
    } catch (e) {
      console.log('Erro: ', e);
      return e;
    }
  }
}

export type UpdateLevelAndReportProps = {
  memberNumber: number;
  levelId: string;
  reportId: string;
};
