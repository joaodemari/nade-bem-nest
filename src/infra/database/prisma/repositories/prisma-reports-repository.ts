import {
  Area,
  Branch,
  Level,
  Period,
  Prisma,
  Report,
  ReportAndSteps,
  Step,
  Swimmer,
  Teacher,
} from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaReportsRepository implements ReportsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }

  async create(data: Prisma.ReportCreateInput) {
    return await this.prisma.report.create({ data });
  }

  async updateReportById(
    data: Prisma.ReportCreateInput,
    id: string,
  ): Promise<Report> {
    await this.deleteReportStepsByReportId(id);

    return await this.prisma.report.update({
      data,
      where: { id },
    });
  }

  async deleteReportStepsByReportId(id: string): Promise<void> {
    await this.prisma.reportAndSteps.deleteMany({
      where: { reportId: id },
    });
  }

  async findOneById({ reportId }: { reportId: string }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        branch: Branch;
        areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
      } & Level)
    | null
  > {
    try {
      let report = await this.prisma.report.findFirst({
        where: {
          id: reportId,
        },
        include: {
          level: {
            include: {
              areas: { include: { steps: { orderBy: { points: 'asc' } } } },
            },
          },
          ReportAndSteps: { include: { step: true } },
          swimmer: { include: { Teacher: true } },
          Period: {
            include: {
              Branch: true,
            },
          },
          teacher: true,
        },
      });

      let reportLevel: ({ areas: ({ steps: Step[] } & Area)[] } & Level) | null;
      reportLevel = report.level;
      return {
        ...reportLevel,
        branch: report.Period.Branch,
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
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateRightLevelsToReport() {
    const levelAndReports = new Map<string, string[]>();

    await this.prisma.reportAndSteps
      .findMany({
        include: {
          step: {
            include: {
              Area: {
                include: {
                  Level: true,
                },
              },
            },
          },
        },
      })
      .then((reportAndSteps) => {
        reportAndSteps.forEach((reportAndStep) => {
          const levelId = reportAndStep.step.Area.Level.id;
          if (levelAndReports.has(levelId)) {
            levelAndReports.set(levelId, [
              ...levelAndReports.get(levelId),
              reportAndStep.reportId,
            ]);
          } else {
            levelAndReports.set(levelId, [reportAndStep.reportId]);
          }
        });
      });

    const levels = Array.from(levelAndReports.keys());

    Promise.all([
      levels.forEach(async (levelId) => {
        await this.prisma.report.updateMany({
          where: {
            id: {
              in: levelAndReports.get(levelId),
            },
          },
          data: {
            levelId,
          },
        });
      }),
    ]);
  }

  async deleteReportById(reportId: string): Promise<void> {
    throw new Error('Method not implemented.');

    const swimmer: Swimmer = await this.prisma.report
      .findFirst({
        where: {
          id: reportId,
        },
        include: {
          swimmer: true,
        },
      })
      .then((report) => (report ? report.swimmer : null));

    if (!swimmer) return;

    await this.prisma.reportAndSteps.deleteMany({
      where: {
        reportId,
      },
    });

    await this.prisma.report.delete({
      where: {
        id: reportId,
      },
    });

    // if (swimmer.lastReportId === reportId) {
    //   const swimmerId = swimmer.id;

    //   const lastReportCreated: Report | null = await this.prisma.report
    //     .findFirst({
    //       where: {
    //         idSwimmer: swimmerId,
    //       },
    //       orderBy: { createdAt: 'desc' },
    //     })
    //     .then((report) => (report ? report : null));

    //   await this.prisma.swimmer.update({
    //     where: {
    //       id: swimmerId,
    //     },
    //     data: {
    //       lastReportId: lastReportCreated ? lastReportCreated.id : null,
    //     },
    //   });
    // }
  }

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
        branch: Branch;
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
          Period: {
            include: {
              Branch: true,
            },
          },
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
            branch: Branch;
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
            branch: report.Period.Branch,
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
        branch: Branch;
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
          Period: {
            include: {
              Branch: true,
            },
          },
          teacher: true,
        },
      });

      let reportsLevelWithSelectedSteps:
        | ({
            observation: string;
            swimmer: Swimmer;
            teacher: Teacher;
            period: Period;
            branch: Branch;
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
            branch: report.Period.Branch,
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
          ReportAndSteps: { include: { step: { include: { Area: true } } } },
          swimmerTeacherPeriodSelection: {
            include: {
              swimmer: true,
              teacherPeriodGroupSelection: {
                include: {
                  teacher: true,
                  period: true,
                },
              },
            },
          },
        },
      });

      const reportLevel:
        | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
        | null = report.level;

      console.log('reportAndSteps', report.ReportAndSteps);

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
        period:
          report.swimmerTeacherPeriodSelection.teacherPeriodGroupSelection
            .period,
        observation: report.observation,
        swimmer: report.swimmerTeacherPeriodSelection.swimmer,
        teacher:
          report.swimmerTeacherPeriodSelection.teacherPeriodGroupSelection
            .teacher,
        areas: reportLevel.areas.map((area) => {
          console.log('area', area);

          return {
            ...area,
            lastReportStepId: report.ReportAndSteps.find(
              (step) => step.step.areaId === area.id,
            )?.stepId,
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
                include: {
                  steps: {
                    include: { ReportAndSteps: true },
                    orderBy: {
                      points: 'asc',
                    },
                  },
                },
              },
            },
          },
          Period: true,
        },
      });

      if (!report) return null;

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
