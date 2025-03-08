import { SwimmersRepository } from '../../../../domain/repositories/swimmers-repository';
import { SwimmerEvo } from '../../../../domain/evo/entities/swimmer-evo-entity';
import { SwimmerEvoMapper } from '../../../../domain/evo/mappers/swimmer-evo-mapper';
import { PrismaService } from '../prisma.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Level,
  Prisma,
  Swimmer,
  SwimmerPeriodTeacherSelection,
  Teacher,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import capitalizeName from '../../../../core/utils/capitalizeName';
import { ListAllSwimmersProps } from '../../../http/dtos/ListSwimmers.dto';
import { swimmerAndReport } from '../../../../domain/services/swimmers.service';
import { UpdateLevelAndReportProps } from '../../../../domain/services/reports/templates/create-report.service';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';
import generatePhotoUrl from '../../../../core/utils/generatePhotoUrl';

export type SwimmerAndSelctionsAndGroupSelectionsAndTeacher = Swimmer & {
  periodTeacherSelections: (SwimmerPeriodTeacherSelection & {
    teacherPeriodGroupSelection: TeacherPeriodGroupSelection & {
      teacher: Teacher;
    };
  })[];
  Teacher: Teacher;
};

@Injectable()
export class PrismaSwimmersRepository implements SwimmersRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }

  async updateLevelAndReport({
    swimmerSelectionId,
    levelId,
  }: UpdateLevelAndReportProps) {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: {
        periodTeacherSelections: {
          some: {
            id: swimmerSelectionId,
          },
        },
      },
    });

    await this.prisma.swimmer.update({
      where: { id: swimmer.id },
      data: {
        actualLevel: {
          connect: {
            id: levelId,
          },
        },
      },
    });
  }

  async findByMemberNumber(memberNumber: number) {
    return await this.prisma.swimmer.findFirst({
      where: { memberNumber },
    });
  }

  async querySwimmers({
    branchId,
    search,
  }: {
    branchId: string;
    search: string;
  }): Promise<SwimmerAndSelctionsAndGroupSelectionsAndTeacher[]> {
    const swimmers = await this.prisma.swimmer.findMany({
      where: {
        branchId,
        OR: [
          {
            memberNumberStr: {
              startsWith: search,
            },
          },
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        periodTeacherSelections: {
          include: {
            teacherPeriodGroupSelection: {
              include: {
                teacher: true,
              },
            },
          },
        },
        Teacher: true,
      },
      take: 10,
    });

    return swimmers.map((s) => {
      return {
        ...s,
        photoUrl: s.photoUrl ?? generatePhotoUrl(s.name),
        name: capitalizeName(s.name),
      };
    });
  }

  async updateLevelOfSwimmers(): Promise<void> {
    throw new Error('Method not implemented.');
    const swimmers = await this.prisma.swimmer.findMany({
      include: {
        actualLevel: true,
      },
    });

    const levelNumbers = [1, 2, 3, 4, 5];
    const levelInformation = new Map<number, Level>();

    for (let i = 0; i < levelNumbers.length; i++) {
      const levelNumber = levelNumbers[i];

      const level = await this.prisma.level.findFirst({
        where: {
          levelNumber,
        },
      });

      if (level) levelInformation.set(levelNumber, level);
    }

    const swimmersByLevel = new Map<number, string[]>();

    const numberOfSwimmers = swimmers.length;

    swimmers.forEach((swimmer, i) => {
      let levelToBeUpdated = 1;

      // if (swimmer.lastReportAccess === null) {
      //   levelToBeUpdated = 1;
      // } else if (
      //   swimmer.lastReportAccess.approved === true &&
      //   swimmer.actualLevel.levelNumber < 5
      // ) {
      //   levelToBeUpdated = swimmer.lastReportAccess.level.levelNumber + 1;
      // } else {
      //   levelToBeUpdated = swimmer.lastReportAccess.level.levelNumber;
      // }

      console.log(i + 'swimmer of' + numberOfSwimmers);

      if (!swimmersByLevel.has(levelToBeUpdated)) {
        swimmersByLevel.set(levelToBeUpdated, []);
      }

      swimmersByLevel.get(levelToBeUpdated)?.push(swimmer.id);
    });

    await Promise.all(
      levelNumbers.map(async (levelNumber) => {
        const levelToBeUpdated = levelInformation.get(levelNumber);
        const swimmersToUpdate = swimmersByLevel.get(levelNumber);

        if (!levelToBeUpdated || !swimmersToUpdate) {
          console.log('something went wrong');
          return;
        }

        await this.prisma.swimmer.updateMany({
          where: {
            id: { in: swimmersToUpdate },
          },
          data: {
            actualLevelName: levelInformation.get(levelNumber)?.name,
          },
        });
      }),
    );
  }
  async createSwimmerFromEvo(
    swimmer: SwimmerEvo,
    branchId: string,
    teacherAuthId: string,
  ): Promise<Swimmer> {
    let teacherId = await this.prisma.branchTeacher
      .findUnique({
        where: {
          branchId_teacherNumber: {
            branchId,
            teacherNumber: swimmer.idEmployeeInstructor,
          },
        },
        select: {
          teacherId: true,
        },
      })
      .then((result) => result?.teacherId);

    if (!teacherId) {
      const teacher = await this.prisma.teacher.findFirst({
        where: {
          authId: teacherAuthId,
        },
      });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      teacherId = teacher.id;
    }

    const swimmerInPrisma = await this.prisma.swimmer.create({
      data: SwimmerEvoMapper.toPersistence(swimmer, branchId, teacherId),
    });

    return {
      ...swimmerInPrisma,
      photoUrl:
        swimmerInPrisma.photoUrl ?? generatePhotoUrl(swimmerInPrisma.name),
      name: capitalizeName(swimmerInPrisma.name),
    };
  }

  async upsertManyFromEvo(
    swimmers: SwimmerEvo[],
    branchId: string,
  ): Promise<void> {
    if (swimmers.length === 0) return;

    //TODO: Found bug of teacher that is not in the branch

    const teacherNumbersMap = await this.buildTeacherNumbersMap(branchId);

    await Promise.all(
      swimmers.map(async (swimmer) => {
        const teacherId = teacherNumbersMap.get(swimmer.idEmployeeInstructor);

        console.log('teacherId', teacherId);

        await this.prisma.swimmer
          .upsert({
            where: {
              memberNumber: swimmer.idMember,
            },
            update: SwimmerEvoMapper.updateInPersistence(
              swimmer,
              branchId,
              teacherId,
            ),
            create: SwimmerEvoMapper.toPersistence(
              swimmer,
              branchId,
              teacherId,
            ),
          })
          .catch((error) => {
            console.error(error);
          });
      }),
    );
  }

  buildTeacherNumbersMap = async (branchId: string) => {
    const branchTeachers = await this.prisma.branchTeacher.findMany({
      where: {
        branchId,
      },
      include: {
        teacher: true,
      },
    });

    const teacherNumbersMap = new Map<number, string>();

    branchTeachers.forEach((bt) => {
      teacherNumbersMap.set(bt.teacherNumber, bt.teacher.id);
    });

    return teacherNumbersMap;
  };

  async updateSwimmerTeacher(
    swimmerNumber: number,
    teacherAuthId: string,
  ): Promise<void> {
    await this.prisma.swimmer.update({
      where: {
        memberNumber: swimmerNumber,
      },
      data: {
        Teacher: {
          connect: {
            authId: teacherAuthId,
          },
        },
      },
    });
  }

  async countSwimmers(teacherAuthId: string): Promise<number> {
    return this.prisma.swimmer.count({
      where: {
        Teacher: {
          authId: teacherAuthId,
        },
      },
    });
  }

  async countSwimmersWithoutReport(
    teacherAuthId: string,
    periodStartDate: Date,
  ): Promise<number> {
    const swimmers = await this.prisma.swimmer.findMany({
      where: {
        Teacher: {
          authId: teacherAuthId,
        },
      },
    });

    throw new Error('Method not implemented.');
  }

  findInfoToUpdateSwimmerTeacher = async (swimmerId: string) => {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: {
        id: swimmerId,
      },
      select: {
        memberNumber: true,
        Teacher: {
          select: {
            authId: true,
          },
        },
      },
    });

    return swimmer;
  };

  async findManyByTeacher(teacherId: string, branchId: string) {
    if (!teacherId) return [];

    const swimmers = await this.prisma.swimmer.findMany({
      where: {
        Teacher: {
          id: teacherId,
        },
        branchId,
      },

      include: {
        Report: { orderBy: { createdAt: 'asc' } },
      },
    });

    // swimmers = swimmers.sort((a, b) => {
    //     const aLastReport = a.lastReport ?? new Date();
    //     const bLastReport = b.lastReport ?? new Date();

    //     console.log("aLastReport", aLastReport);
    //     console.log("bLastReport", bLastReport);
    //     if (aLastReport > bLastReport) {
    //         return -1;
    //     }
    //     if (aLastReport < bLastReport) {
    //         return 1;
    //     }
    //     return 0;
    // });

    return swimmers.map((swimmer) => {
      return {
        ...swimmer,
        photoUrl: swimmer.photoUrl ?? generatePhotoUrl(swimmer.name),
        name: capitalizeName(swimmer.name),
      };
    });
  }

  async findManyPaginated({
    branchId,
    page,
    perPage,
    search,
    onlyActive,
    teacherAuthId,
  }: ListAllSwimmersProps): Promise<{
    swimmers: swimmerAndReport[];
    totalSwimmers: number;
  }> {
    const where: Prisma.SwimmerWhereInput = {
      branchId,
    };

    if (onlyActive) {
      where.isActive = onlyActive;
    }

    if (Number.isNaN(parseInt(search))) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    } else {
      where.memberNumber = parseInt(search);
    }

    if (teacherAuthId) {
      where.Teacher = {
        authId: teacherAuthId,
      };
    }

    console.log('where', where);

    const swimmers = await this.prisma.swimmer.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        Report: { orderBy: { createdAt: 'asc' } },
      },
    });

    const swimmersCount = await this.prisma.swimmer.count({
      where,
    });

    // swimmers = swimmers.sort((a, b) => {
    //     const aLastReport = a.lastReport ?? new Date();
    //     const bLastReport = b.lastReport ?? new Date();

    //     console.log("aLastReport", aLastReport);
    //     console.log("bLastReport", bLastReport);
    //     if (aLastReport > bLastReport) {
    //         return -1;
    //     }
    //     if (aLastReport < bLastReport) {
    //         return 1;
    //     }
    //     return 0;
    // });

    return {
      swimmers: swimmers.map((swimmer) => {
        return {
          ...swimmer,
          photoUrl: swimmer.photoUrl ?? generatePhotoUrl(swimmer.name),
          name: capitalizeName(swimmer.name),
        };
      }),
      totalSwimmers: swimmersCount,
    };
  }

  async upsertOneFromEvo(
    swimmer: SwimmerEvo,
    branchId: string,
    teacherId: string,
  ): Promise<Swimmer | null> {
    const data = SwimmerEvoMapper.toPersistence(swimmer, branchId, teacherId);
    return this.prisma.swimmer
      .upsert({
        where: {
          memberNumber: swimmer.idMember,
        },
        update: data,
        create: data,
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  async deleteDuplicates(): Promise<void> {
    const swimmers = await this.prisma.swimmer.findMany({
      select: {
        memberNumber: true,
        id: true,
      },
    });

    const memberNumbers = swimmers.map((swimmer) => swimmer.memberNumber);

    const duplicates = memberNumbers.filter(
      (memberNumber, index) => memberNumbers.indexOf(memberNumber) !== index,
    );

    duplicates.map(async (memberNumber) => {
      const swimmer = swimmers.find(
        (swimmer) => swimmer.memberNumber === memberNumber,
      );
      if (swimmer) {
        await this.prisma.swimmer.delete({
          where: {
            id: swimmer.id,
          },
        });
      }
    });
  }

  async findById(id: string) {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: { id },
    });

    if (!swimmer) {
      return null;
    }

    return swimmer;
  }

  async findSwimmerAndReports(idMember: number) {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: { memberNumber: idMember },
      include: {
        Report: {
          select: {
            id: true,
            level: true,
            teacher: { select: { name: true, photoUrl: true } },
            Period: true,
          },
        },
        actualLevel: true,
        Teacher: true,
      },
    });
    if (!swimmer) {
      return null;
    }

    return {
      swimmer: {
        name: capitalizeName(swimmer.name),
        actualLevelName: swimmer.actualLevel.name,
        photoUrl: swimmer.photoUrl ?? generatePhotoUrl(swimmer.name),
        teacher: swimmer.Teacher,
      },
      reports: swimmer.Report.map((report) => {
        return {
          periodName: report.Period.name,
          teacherName: capitalizeName(
            report.teacher?.name ?? swimmer.Teacher.name,
          ),
          teacherPhoto: report.teacher?.photoUrl ?? 'sem url',
          level: report.level.name,
          id: report.id,
        };
      }),
    };
  }

  async findSwimmerAndReportsById(swimmerId: string) {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: { id: swimmerId },
      include: {
        periodTeacherSelections: {
          orderBy: {
            teacherPeriodGroupSelection: {
              period: {
                startDate: 'desc',
              },
            },
          },
          include: {
            Report: {
              include: {
                level: true,
              },
            },
            teacherPeriodGroupSelection: {
              include: {
                teacher: true,
                period: true,
              },
            },
          },
        },
        actualLevel: true,
        Teacher: true,
      },
    });
    if (!swimmer) {
      return null;
    }

    return {
      swimmer: {
        name: capitalizeName(swimmer.name),
        actualLevelName: swimmer.actualLevel.name,
        photoUrl: swimmer.photoUrl ?? generatePhotoUrl(swimmer.name),
        teacher: swimmer.Teacher,
      },
      reports: swimmer.periodTeacherSelections
        .map((selection) => {
          const report = selection.Report;

          if (!report) {
            return;
          }
          const teacher = selection.teacherPeriodGroupSelection?.teacher;
          return {
            periodName: selection.teacherPeriodGroupSelection?.period.name,
            teacherName: capitalizeName(teacher.name ?? 'Não encontrado'),
            teacherPhoto: teacher?.photoUrl ?? 'sem url',
            level: report.level.name,
            id: report.id,
          };
        })
        .filter((report) => report),
    };
  }
}
