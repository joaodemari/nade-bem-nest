import { SwimmersRepository } from '../../../../domain/repositories/swimmers-repository';
import { SwimmerEvo } from '../../../../domain/evo/entities/swimmer-evo-entity';
import { SwimmerEvoMapper } from '../../../../domain/evo/mappers/swimmer-evo-mapper';
import { PrismaSwimmersMapper } from '../mappers/prisma-swimmers-mapper';
import { SwimmerEntity } from '../../../../domain/entities/swimmer-entity';
import { PrismaBaseRepository } from './prisma-base-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import PeriodsRepository from '../../../../domain/repositories/periods-repository';
import { SwimmerInfoResponse } from '../../../http/dtos/swimmers/swimmerInfo.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { EnvService } from '../../../env/env.service';
import capitalizeName from '../../../../core/utils/capitalizeName';

@Injectable()
export class PrismaSwimmersRepository
  extends PrismaBaseRepository<SwimmerEntity>
  implements SwimmersRepository
{
  constructor(
    prisma: PrismaService,
    private readonly periodsRepository: PeriodsRepository,
    private readonly env: EnvService,
  ) {
    super(prisma, 'swimmer');
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

  async findManyByTeacher(
    teacherNumber: number,
    branchId: string,
  ): Promise<SwimmerEntity[]> {
    if (!teacherNumber) return [];

    const where: Prisma.SwimmerWhereInput =
      teacherNumber === 8888
        ? {
            branchId,
          }
        : {
            teacherNumber,
            branchId,
          };

    const swimmers = await this.prisma.swimmer.findMany({
      where,
      orderBy: {
        lastReport: 'asc',
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

    return swimmers.map((swimmer) => PrismaSwimmersMapper.toDomain(swimmer));
  }

  async upsertManyFromEvo(swimmersInEvo: SwimmerEvo[]): Promise<void> {
    if (swimmersInEvo.length === 0) return;

    await Promise.all(
      swimmersInEvo.map(async (swimmer) => {
        const SwimmerEntity = SwimmerEvoMapper.toDomain(swimmer);
        const data = PrismaSwimmersMapper.toPersistence(SwimmerEntity);
        await this.prisma.swimmer
          .upsert({
            where: {
              memberNumber: swimmer.idMember,
            },
            update: data,
            create: data,
          })
          .catch((error) => {
            console.error(error);
          });
      }),
    );
  }

  async upsertOneFromEvo(swimmer: SwimmerEvo): Promise<SwimmerEntity | null> {
    const SwimmerEntity = SwimmerEvoMapper.toDomain(swimmer);
    const data = PrismaSwimmersMapper.toPersistence(SwimmerEntity);
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

    return PrismaSwimmersMapper.toDomain(swimmer);
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
          period: report.id,
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

  async createSwimmerFromEvoService(
    memberNumber: number,
  ): Promise<SwimmerInfoResponse | null> {
    try {
      const url = `https://evo-integracao.w12app.com.br/api/v1/members/${memberNumber}`;
      const evo_cred = this.env.get('EVO_CRED');
      const credentials = btoa(evo_cred);
      const { data }: { data: SwimmerEvo } = await axios.get(url, {
        headers: {
          Authorization: `Basic ${credentials}`, // Use btoa here
        },
      });

      const swimmer = await this.upsertOneFromEvo(data);
      return {
        swimmer: {
          name: swimmer.name,
          actualLevel: swimmer.actualLevelName,
          photoUrl: swimmer.photoUrl,
        },
        reports: [],
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
