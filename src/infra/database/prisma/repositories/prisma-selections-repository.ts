import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import {
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

@Injectable()
export class PrismaSelectionsRepository implements SelectionsRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
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
    return await this.prisma.swimmer
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

  async findWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        swimmer: SwimmerAndTeacher;
      }[];
    }
  > {
    const selection = await this.prisma.teacherPeriodGroupSelection.findUnique({
      where: {
        teacherAuthId_periodId: {
          teacherAuthId: props.teacherAuthId,
          periodId: props.periodId,
        },
      },
      include: {
        swimmerSelections: {
          include: {
            swimmer: {
              include: {
                Teacher: true,
              },
            },
          },
        },
      },
    });

    return selection;
  }
}
