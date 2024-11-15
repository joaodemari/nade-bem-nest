import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';
import { Prisma, Report } from '@prisma/client';

@Injectable()
export class PostReportService {
  constructor(private readonly prisma: PrismaService) {}

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
      const level = await this.prisma.level.findFirst({
        where: { id: levelId },
        include: { areas: { include: { steps: true } } },
      });

      const approved = steps.every((stepId) => {
        const step = level?.areas
          .find((area) => area.steps.some((s) => s.id === stepId))
          ?.steps.find((s) => s.id === stepId);
        return step?.points === 3;
      });

      if (!level) throw new Error('Level not found');

      const teacherNumber = await this.prisma.swimmer.findFirst({
        where: { memberNumber },
        select: { teacherNumber: true },
      });

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
        teacher: { connect: { teacherNumber: teacherNumber?.teacherNumber } },
      };
      let report: Report;

      if (id !== 'new') {
        await this.prisma.reportAndSteps.deleteMany({
          where: { reportId: id },
        });

        report = await this.prisma.report.update({
          data,
          where: { id },
        });
        if (!report) throw new Error('Report not found');
      } else {
        report = await this.prisma.report.create({ data });
      }
      await this.prisma.swimmer.update({
        where: { memberNumber: memberNumber },
        data: {
          actualLevel: {
            connect: {
              id: levelId,
            },
          },
          lastReport: new Date(),
          lastReportAccess: {
            connect: {
              id: report.id,
            },
          },
        },
      });
      return report;
    } catch (e) {
      console.log('Erro: ', e);
      return e;
    }
  }
}
