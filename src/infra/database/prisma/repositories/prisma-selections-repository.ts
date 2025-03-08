import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import {
  SelectionReportInfoSelectedSteps,
  SelectionsRepository,
  SwimmerAndTeacher,
} from '../../../../domain/repositories/selections-repository';
import {
  UpdateSwimmerFromSelectionProps,
  GetSwimmersFromPeriodAndTeacherProps,
  RemoveSwimmerTeacherSelectionProps,
  ResetSwimmersFromGroupSelectionProps,
} from '../../../../domain/services/selection/selection.service';
import {
  Report,
  Swimmer,
  SwimmerPeriodTeacherSelection,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import { SelectionSwimmersQueryDTO } from '../../../http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import {
  PageNumberCounters,
  PageNumberPagination,
} from 'prisma-extension-pagination/dist/types';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '../prisma.extension';
import generatePhotoUrl from '../../../../core/utils/generatePhotoUrl';

@Injectable()
export class PrismaSelectionsRepository implements SelectionsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
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
