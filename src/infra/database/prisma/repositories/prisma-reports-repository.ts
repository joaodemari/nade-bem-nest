import { Area, Level, Period, Step, Swimmer, Teacher } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaReportsRepository implements ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByTeacher({
    teacherId,
    periodId,
  }: {
    teacherId: string;
    periodId: string;
  }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)[]
    | null
  > {
    try {
      let reports = await this.prisma.report.findMany({
        where: {
          swimmer: {
            Teacher: {
              id: teacherId,
            },
          },
          periodId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          level: {
            include: {
              areas: { include: { steps: { orderBy: { points: 'asc' } } } },
            },
          },
          ReportAndSteps: { include: { step: true } },
          swimmer: { include: { Teacher: true } },
          Period: true,
          teacher: true,
        },
      });

      console.log(reports.length);

      let reportsLevelWithSelectedSteps:
        | ({
            observation: string;
            swimmer: Swimmer;
            teacher: Teacher;
            period: Period;
            areas: ({
              lastReportStepId: string;
              steps: Step[];
            } & Area)[];
          } & Level)[]
        | null;

      const swimmersLastReports: {
        [memberNumber: number]: string;
      } = reports.reduce((acc: { [memberNumber: number]: string }, report) => {
        if (!acc[report.swimmer.memberNumber]) {
          acc[report.swimmer.memberNumber] = report.id;
          return acc;
        }
        return acc;
      }, {});

      reportsLevelWithSelectedSteps = reports
        .filter((report) => {
          if (!swimmersLastReports[report.swimmer.memberNumber]) {
            return false;
          }
          if (report.id !== swimmersLastReports[report.swimmer.memberNumber]) {
            return false;
          }
          return true;
        })
        .map((report) => {
          let reportLevel:
            | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
            | null;
          reportLevel = report.level;
          return {
            ...reportLevel,
            period: report.Period,
            observation: report.observation,
            swimmer: report.swimmer,
            teacher: report.swimmer.Teacher,
            areas: reportLevel.areas.map((area) => {
              return {
                ...area,
                lastReportStepId:
                  report.ReportAndSteps.find(
                    (step) => step.step.areaId === area.id,
                  )?.stepId ?? '',
              };
            }),
          };
        });

      return reportsLevelWithSelectedSteps;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findManyBySwimmers({
    swimmerIds,
    periodId,
  }: {
    swimmerIds: string[];
    periodId: string;
  }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)[]
    | null
  > {
    try {
      let report = await this.prisma.report.findMany({
        where: {
          swimmer: {
            id: { in: swimmerIds },
          },
          periodId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          level: {
            include: {
              areas: { include: { steps: { orderBy: { points: 'asc' } } } },
            },
          },
          ReportAndSteps: { include: { step: true } },
          swimmer: { include: { Teacher: true } },
          Period: true,
          teacher: true,
        },
      });

      let reportsLevelWithSelectedSteps:
        | ({
            observation: string;
            swimmer: Swimmer;
            teacher: Teacher;
            period: Period;
            areas: ({
              lastReportStepId: string;
              steps: Step[];
            } & Area)[];
          } & Level)[]
        | null;

      const swimmersLastReports: {
        [memberNumber: number]: string;
      } = report.reduce((acc: { [memberNumber: number]: string }, report) => {
        if (!acc[report.swimmer.memberNumber]) {
          acc[report.swimmer.memberNumber] = report.id;
          return acc;
        }
        return acc;
      }, {});

      reportsLevelWithSelectedSteps = report
        .filter((report) => {
          if (!swimmersLastReports[report.swimmer.memberNumber]) {
            return false;
          }
          if (report.id !== swimmersLastReports[report.swimmer.memberNumber]) {
            return false;
          }
          return true;
        })
        .map((report) => {
          let reportLevel:
            | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
            | null;
          reportLevel = report.level;
          return {
            ...reportLevel,
            period: report.Period,
            observation: report.observation,
            swimmer: report.swimmer,
            teacher: report.swimmer.Teacher,
            areas: reportLevel.areas.map((area) => {
              return {
                ...area,
                lastReportStepId:
                  report.ReportAndSteps.find(
                    (step) => step.step.areaId === area.id,
                  )?.stepId ?? '',
              };
            }),
          };
        });

      return reportsLevelWithSelectedSteps;
    } catch (e) {
      console.log(e);
      return null;
    }
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
          teacher: true,
          ReportAndSteps: { include: { step: true } },
          swimmer: true,
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
        teacher: report.teacher,
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

  async deleteInvalidReports(): Promise<void> {
    const reports = await this.prisma.report.findMany({});

    const idsToDelete = reports.filter((report) => {
      return report.observation.length < 10;
    });

    await this.prisma.reportAndSteps.deleteMany({
      where: {
        reportId: {
          in: idsToDelete.map((report) => report.id),
        },
      },
    });

    await this.prisma.report.deleteMany({
      where: {
        id: {
          in: idsToDelete.map((report) => report.id),
        },
      },
    });
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
