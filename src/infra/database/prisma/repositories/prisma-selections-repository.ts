import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Report,
  SwimmerPeriodTeacherSelection,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import { GetBatchResult } from '@prisma/client/runtime/library';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  PageNumberCounters,
  PageNumberPagination,
} from 'prisma-extension-pagination/dist/types';
import generatePhotoUrl from '../../../../core/utils/generatePhotoUrl';
import {
  SelectionReportInfoSelectedSteps,
  SelectionsRepository,
  SwimmerAndTeacher,
} from '../../../../domain/repositories/selections-repository';
import {
  GetSwimmersFromPeriodAndTeacherProps,
  RemoveSwimmerTeacherSelectionProps,
  ResetSwimmersFromGroupSelectionProps,
  UpdateSwimmerFromSelectionProps,
} from '../../../../domain/services/selection/selection.service';
import { SelectionSwimmersQueryDTO } from '../../../http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaSelectionsRepository implements SelectionsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }
  async createUnexistantSelections(): Promise<GetBatchResult> {
    const reportsOfGroup = await this.prisma.report.findMany({
      distinct: ['periodId', 'idTeacher'],
      include: {
        teacher: true,
      },
    });

    const groupsThatAlreadyExists =
      await this.prisma.teacherPeriodGroupSelection.findMany({
        where: {
          teacherId: {
            in: reportsOfGroup
              .map((report) => report.idTeacher)
              .filter(Boolean),
          },
          periodId: {
            in: reportsOfGroup.map((report) => report.periodId).filter(Boolean),
          },
        },
      });

    const nonRepeatedGroupSelections = reportsOfGroup
      .reduce<
        {
          teacherAuthId: string;
          periodId: string;
          idTeacher: string;
        }[]
      >((acc, report) => {
        if (
          report.teacher &&
          !acc.some(
            (groupSelection) =>
              groupSelection.teacherAuthId === report.teacher.authId &&
              groupSelection.periodId === report.periodId,
          )
        ) {
          acc.push({
            teacherAuthId: report.teacher.authId,
            periodId: report.periodId,
            idTeacher: report.idTeacher,
          });
        }
        return acc;
      }, [])
      .filter((groupSelection) => {
        return !groupsThatAlreadyExists.some(
          (group) =>
            group.teacherAuthId === groupSelection.teacherAuthId &&
            group.periodId === groupSelection.periodId,
        );
      });

    if (nonRepeatedGroupSelections.length !== 0) {
      await this.prisma.teacherPeriodGroupSelection.createMany({
        data: nonRepeatedGroupSelections.map((groupSelection) => ({
          teacherId: groupSelection.idTeacher,
          teacherAuthId: groupSelection.teacherAuthId,
          periodId: groupSelection.periodId,
        })),
      });
    }

    const reports = await this.prisma.report.findMany({
      where: {
        swimmerTeacherPeriodSelection: null,
      },
      distinct: ['periodId', 'idTeacher', 'idSwimmer'],
      include: {
        teacher: true,
      },
    });

    console.log('reports', reports.length);

    const groupSelectionsMap =
      await this.prisma.teacherPeriodGroupSelection.findMany();

    const nonRepeatedReports = reports.reduce<
      {
        idSwimmer: string;
        teacherAuthId: string;
        periodId: string;
      }[]
    >((acc, report) => {
      console.log('report.teacher', Boolean(report.teacher));
      console.log(
        'some',
        !acc.some(
          (selection) =>
            selection.idSwimmer === report.idSwimmer &&
            selection.teacherAuthId === report.teacher.authId &&
            selection.periodId === report.periodId,
        ),
      );

      if (
        report.teacher &&
        !acc.some(
          (selection) =>
            selection.idSwimmer === report.idSwimmer &&
            selection.teacherAuthId === report.teacher.authId &&
            selection.periodId === report.periodId,
        )
      ) {
        acc.push({
          idSwimmer: report.idSwimmer,
          teacherAuthId: report.teacher.authId,
          periodId: report.periodId,
        });
      }
      return acc;
    }, []);

    console.log('nonRepeatedSelections', nonRepeatedReports.length);

    console.log('nonRepeatedSelections', nonRepeatedReports.slice(0, 10));
    console.log(
      'groupSelectionsMap',
      groupSelectionsMap.entries().next().value,
    );

    const selectionsData = nonRepeatedReports
      .map((selection) => {
        const groupSelection = groupSelectionsMap.find(
          (groupSelection) =>
            groupSelection.teacherAuthId === selection.teacherAuthId &&
            groupSelection.periodId === selection.periodId,
        );

        if (!groupSelection) {
          return;
        }
        return {
          swimmerId: selection.idSwimmer,
          teacherPeriodGroupSelectionId: groupSelection.id,
          periodId: selection.periodId,
        };
      })
      .filter(Boolean);

    console.log('selectionsData', selectionsData.length);

    if (selectionsData.length !== 0) {
      const batchResult =
        await this.prisma.swimmerPeriodTeacherSelection.createMany({
          data: selectionsData,
        });

      return batchResult;
    }
    return null;
  }
  async findLastSelectionBySwimmerIdAndSelectionId(
    swimmerId: string,
    selectionId: string,
  ): Promise<SelectionReportInfoSelectedSteps | null> {
    const selection =
      await this.prisma.swimmerPeriodTeacherSelection.findUnique({
        where: {
          id: selectionId,
        },
        include: {
          Report: true,
          teacherPeriodGroupSelection: {
            include: {
              period: true,
            },
          },
        },
      });

    const lastSelectionBefore =
      await this.prisma.swimmerPeriodTeacherSelection.findFirst({
        where: {
          swimmerId: swimmerId,
          teacherPeriodGroupSelection: {
            period: {
              startDate: {
                lt: selection.teacherPeriodGroupSelection.period.startDate,
              },
            },
          },
        },
        include: {
          Report: {
            include: {
              level: {
                include: {
                  areas: {
                    include: {
                      steps: true,
                    },
                  },
                },
              },
              ReportAndSteps: {
                include: {
                  step: true,
                },
              },
            },
          },
        },
        orderBy: {
          teacherPeriodGroupSelection: {
            period: {
              startDate: 'desc',
            },
          },
        },
      });

    if (!lastSelectionBefore) {
      return null;
    }

    return {
      ...lastSelectionBefore,
      Report: {
        ...lastSelectionBefore.Report,
        selectedSteps: lastSelectionBefore.Report.ReportAndSteps.map(
          (reportAndStep) => reportAndStep.step,
        ),
      },
    };
  }

  async findById(id: string): Promise<SelectionReportInfoSelectedSteps | null> {
    const selection =
      await this.prisma.swimmerPeriodTeacherSelection.findUnique({
        where: {
          id: id,
        },
        include: {
          Report: {
            include: {
              level: {
                include: {
                  areas: {
                    include: {
                      steps: true,
                    },
                  },
                },
              },
              ReportAndSteps: {
                include: {
                  step: true,
                },
              },
            },
          },
        },
      });

    if (!selection) {
      return null;
    }

    return {
      ...selection,
      Report: selection.Report && {
        ...selection.Report,
        selectedSteps: selection.Report.ReportAndSteps.map(
          (reportAndStep) => reportAndStep.step,
        ),
      },
    };
  }

  async resetSwimmersFromSelection(
    props: ResetSwimmersFromGroupSelectionProps,
  ): Promise<void> {
    await this.prisma.swimmerPeriodTeacherSelection.deleteMany({
      where: {
        teacherPeriodGroupSelection: {
          teacher: {
            authId: props.teacherAuthId,
          },
          periodId: props.periodId,
        },
      },
    });

    const swimmersFromTeacher = await this.prisma.swimmer.findMany({
      where: {
        Teacher: {
          authId: props.teacherAuthId,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    let groupSelection =
      await this.prisma.teacherPeriodGroupSelection.findUnique({
        where: {
          teacherAuthId_periodId: {
            teacherAuthId: props.teacherAuthId,
            periodId: props.periodId,
          },
        },
      });

    if (!groupSelection) {
      groupSelection = await this.createGroupSelection(
        props.teacherAuthId,
        props.periodId,
      );
    }

    await this.prisma.swimmerPeriodTeacherSelection.createMany({
      data: swimmersFromTeacher.map((swimmer) => ({
        periodId: props.periodId,
        swimmerId: swimmer.id,
        teacherPeriodGroupSelectionId: groupSelection.id,
      })),
    });
  }

  async findSwimmersByBranchAndPeriodPaginated({
    search,
    periodId,
    teacherAuthId,
    page,
    perPage,
  }: SelectionSwimmersQueryDTO): Promise<
    [SwimmerAndTeacher[], PageNumberPagination & PageNumberCounters]
  > {
    let [swimmers, metadata] = await this.prisma.swimmer
      .paginate({
        where: {
          periodTeacherSelections: {
            some: {
              periodId: periodId,
              teacherPeriodGroupSelection: {
                teacher: {
                  authId: teacherAuthId,
                },
              },
            },
          },
        },
        include: {
          Teacher: true,
        },
      })
      .withPages({
        page: page,
        limit: perPage,
        includePageCount: true,
      });

    swimmers = swimmers.map((swimmer) => ({
      ...swimmer,
      photoUrl: generatePhotoUrl(swimmer.name),
      name: swimmer.name,
    }));

    return [swimmers, metadata];
  }

  async createGroupSelection(
    teacherAuthId: string,
    periodId: string,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        swimmer: SwimmerAndTeacher;
      }[];
    }
  > {
    const groupSelection = await this.prisma.teacherPeriodGroupSelection.create(
      {
        data: {
          teacher: {
            connect: {
              authId: teacherAuthId,
            },
          },
          period: {
            connect: {
              id: periodId,
            },
          },
        },
      },
    );

    return {
      ...groupSelection,
      swimmerSelections: [],
    };
  }

  async findSelectionBySwimmerAndGroupSelection(props: {
    swimmerId: string;
    groupSelectionId: string;
  }): Promise<SwimmerPeriodTeacherSelection | null> {
    return await this.prisma.swimmerPeriodTeacherSelection.findUnique({
      where: {
        teacherPeriodGroupSelectionId_swimmerId: {
          teacherPeriodGroupSelectionId: props.groupSelectionId,
          swimmerId: props.swimmerId,
        },
      },
    });
  }

  async addSwimmerToSelection(
    props: UpdateSwimmerFromSelectionProps,
  ): Promise<void> {
    await this.prisma.swimmerPeriodTeacherSelection.create({
      data: {
        swimmer: {
          connect: {
            id: props.swimmerId,
          },
        },
        teacherPeriodGroupSelection: {
          connect: {
            id: props.groupSelectionId,
          },
        },
      },
    });
  }

  async removeSwimmerFromSelection(
    props: RemoveSwimmerTeacherSelectionProps,
  ): Promise<void> {
    await this.prisma.swimmerPeriodTeacherSelection.delete({
      where: {
        teacherPeriodGroupSelectionId_swimmerId: {
          teacherPeriodGroupSelectionId: props.groupSelectionId,
          swimmerId: props.swimmerId,
        },
      },
    });
  }

  async findAllWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        swimmer: SwimmerAndTeacher;
        report?: Report;
      }[];
    }
  > {
    let groupSelection =
      await this.prisma.teacherPeriodGroupSelection.findUnique({
        where: {
          teacherAuthId_periodId: {
            teacherAuthId: props.teacherAuthId,
            periodId: props.periodId,
          },
        },
        include: {
          swimmerSelections: {
            include: {
              Report: true,
              swimmer: {
                include: {
                  Teacher: true,
                },
              },
            },
          },
        },
      });

    if (!groupSelection) {
      return null;
    }

    groupSelection.swimmerSelections =
      groupSelection.swimmerSelections?.map((swimmerSelection) => ({
        ...swimmerSelection,
        Report: swimmerSelection.Report ?? undefined,
        swimmer: {
          ...swimmerSelection.swimmer,
          photoUrl:
            swimmerSelection.swimmer.photoUrl ??
            generatePhotoUrl(swimmerSelection.swimmer.name),
        },
      })) ?? [];

    return groupSelection;
  }
}
