import { Area, Level, Period, Step, Swimmer, Teacher } from '@prisma/client';
import { PrismaBaseRepository } from './prisma-base-repository';
import { ReportEntity } from 'src/domain/entities/ReportEntity';
import { PrismaService } from '../prisma.service';
import { ReportsRepository } from 'src/domain/repositories/reports-repository';

export class PrismaReportsRepository
  extends PrismaBaseRepository<ReportEntity>
  implements ReportsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'report');
  }

  async findReportsAreasStepsTeacherSwimmer(reportId: string): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)
    | null
  > {
    try {
      const report = await this.prisma.report.findUnique({
        where: { id: reportId },
        include: {
          level: {
            include: {
              areas: { include: { steps: { orderBy: { points: 'asc' } } } },
            },
          },
          ReportAndSteps: { include: { step: true } },
          swimmer: { include: { Teacher: true } },
          Period: true,
        },
      });

      const reportLevel:
        | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
        | null = report.level;
      const reportLevelWithSelectedSteps:
        | ({
            observation: string;
            swimmer: Swimmer;
            teacher: Teacher;
            period: Period;
            areas: ({
              lastReportStepId: string;
              steps: Step[];
            } & Area)[];
          } & Level)
        | null = {
        ...reportLevel,
        period: report.Period,
        observation: report.observation,
        swimmer: report.swimmer,
        teacher: report.swimmer.Teacher,
        areas: reportLevel.areas.map((area) => {
          return {
            ...area,
            lastReportStepId:
              report.ReportAndSteps.find((step) => step.step.areaId === area.id)
                ?.stepId ?? '',
          };
        }),
      };

      return reportLevelWithSelectedSteps;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findReportAreasSelectedSteps(reportId: string): Promise<{
    level: Level;
    approved: boolean;
    observation: string;
    areas: ({
      lastReportStepId: string;
      steps: Step[];
    } & Area)[];
  } | null> {
    try {
      const report = await this.prisma.report.findUnique({
        where: { id: reportId },
        include: {
          level: {
            include: {
              areas: {
                include: { steps: { include: { ReportAndSteps: true } } },
              },
            },
          },
          Period: true,
        },
      });

      const reportLevelWithSelectedSteps = {
        level: report.level,
        period: report.Period,
        observation: report.observation,
        approved: report.approved,
        areas: report.level.areas.map((area) => {
          return {
            ...area,
            lastReportStepId:
              area.steps.find((step) =>
                step.ReportAndSteps.some(
                  (reportStep) => reportStep.reportId === report.id,
                ),
              )?.id ?? '',
          };
        }),
      };

      return reportLevelWithSelectedSteps;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
