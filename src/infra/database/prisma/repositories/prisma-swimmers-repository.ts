import { SwimmersRepository } from '../../../../domain/repositories/swimmers-repository';
import { SwimmerEvo } from '../../../../domain/evo/entities/swimmer-evo-entity';
import { SwimmerEvoMapper } from '../../../../domain/evo/mappers/swimmer-evo-mapper';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Level, Prisma, Swimmer } from '@prisma/client';
import PeriodsRepository from '../../../../domain/repositories/periods-repository';
import { SwimmerInfoResponse } from '../../../http/dtos/swimmers/swimmerInfo.dto';
import axios from 'axios';
import { EnvService } from '../../../env/env.service';
import capitalizeName from '../../../../core/utils/capitalizeName';
import { ListAllSwimmersProps } from '../../../http/dtos/ListSwimmers.dto';
import { swimmerAndReport } from '../../../../domain/services/swimmers.service';
import { on } from 'events';

@Injectable()
export class PrismaSwimmersRepository implements SwimmersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly periodsRepository: PeriodsRepository,
    private readonly env: EnvService,
  ) {}
  async updateLevelOfSwimmers(): Promise<void> {
    const swimmers = await this.prisma.swimmer.findMany({
      include: {
        actualLevel: true,
        lastReportAccess: {
          include: {
            level: true,
          },
        },
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

      if (swimmer.lastReportAccess === null) {
        levelToBeUpdated = 1;
      } else if (
        swimmer.lastReportAccess.approved === true &&
        swimmer.actualLevel.levelNumber < 5
      ) {
        levelToBeUpdated = swimmer.lastReportAccess.level.levelNumber + 1;
      } else {
        levelToBeUpdated = swimmer.lastReportAccess.level.levelNumber;
      }

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
  ): Promise<Swimmer> {
    return await this.prisma.swimmer.create({
      data: SwimmerEvoMapper.toPersistence(swimmer, branchId),
    });
  }

  async upsertManyFromEvo(
    swimmers: SwimmerEvo[],
    branchId: string,
  ): Promise<void> {
    if (swimmers.length === 0) return;

    await Promise.all(
      swimmers.map(async (swimmer) => {
        await this.prisma.swimmer
          .upsert({
            where: {
              memberNumber: swimmer.idMember,
            },
            update: SwimmerEvoMapper.updateInPersistence(swimmer, branchId),
            create: SwimmerEvoMapper.toPersistence(swimmer, branchId),
          })
          .catch((error) => {
            console.error(error);
          });
      }),
    );
  }

  async updateSwimmerTeacher(
    swimmerNumber: number,
    teacherNumber: number,
  ): Promise<void> {
    await this.prisma.swimmer.update({
      where: {
        memberNumber: swimmerNumber,
      },
      data: {
        teacherNumber,
      },
    });
  }

  async countSwimmers(teacherNumber: number): Promise<number> {
    return this.prisma.swimmer.count({
      where: {
        teacherNumber,
      },
    });
  }

  async countSwimmersWithoutReport(
    teacherNumber: number,
    periodStartDate: Date,
  ): Promise<number> {
    const swimmers = await this.prisma.swimmer.findMany({
      where: {
        teacherNumber,
      },
    });

    const swimmersCount = swimmers.filter((s) => {
      return !s.lastReport || new Date(s.lastReport) < periodStartDate;
    }).length;

    return swimmersCount;
  }

  findInfoToUpdateSwimmerTeacher = async (swimmerId: string) => {
    const swimmer = await this.prisma.swimmer.findFirst({
      where: {
        id: swimmerId,
      },
      select: {
        memberNumber: true,
        teacherNumber: true,
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
      orderBy: {
        lastReport: 'asc',
      },
      include: {
        Report: { orderBy: { createdAt: 'asc' } },
        lastReportAccess: true,
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
        lastReportPeriodId: swimmer.lastReportAccess?.periodId,
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
      const { teacherNumber } = await this.prisma.teacher.findFirst({
        where: {
          authId: teacherAuthId,
        },
        select: {
          teacherNumber: true,
        },
      });

      where.teacherNumber = teacherNumber;
    }

    console.log('where', where);

    const swimmers = await this.prisma.swimmer.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        lastReport: 'asc',
      },
      include: {
        Report: { orderBy: { createdAt: 'asc' } },
        lastReportAccess: true,
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
          lastReportPeriodId: swimmer.lastReportAccess?.periodId,
        };
      }),
      totalSwimmers: swimmersCount,
    };
  }

  async upsertOneFromEvo(
    swimmer: SwimmerEvo,
    branchId: string,
  ): Promise<Swimmer | null> {
    const data = SwimmerEvoMapper.toPersistence(swimmer, branchId);
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
        name: swimmer.name,
        actualLevel: swimmer.actualLevel.name,
        photoUrl: swimmer.photoUrl,
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
}
