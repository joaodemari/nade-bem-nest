import { SwimmerEntity } from '../../../../domain/entities/swimmer-entity';
import { Prisma, Swimmer as PrismaSwimmer } from '@prisma/client';

export class PrismaSwimmersMapper {
  static toDomain(prismaSwimmer: PrismaSwimmer): SwimmerEntity {
    const swimmer = SwimmerEntity.create(
      {
        name: prismaSwimmer.name,
        isActive: prismaSwimmer.isActive,
        actualLevelName: prismaSwimmer.actualLevelName,
        lastAccess: prismaSwimmer.lastAccess.toISOString(),
        memberNumber: prismaSwimmer.memberNumber,
        photoUrl: prismaSwimmer.photoUrl ?? null,
        teacherNumber: prismaSwimmer.teacherNumber ?? null,
        lastReport: prismaSwimmer.lastReport?.toISOString() ?? null,
        lastReportId: prismaSwimmer.lastReportId ?? null,
      },
      prismaSwimmer.id,
    );

    return swimmer;
  }

  static toPersistence(swimmer: SwimmerEntity): Prisma.SwimmerCreateInput {
    const prismaSwimmer: Prisma.SwimmerCreateInput = {
      name: swimmer.name,
      actualLevel: {
        connect: {
          name: swimmer.actualLevelName,
        },
      },
      isActive: swimmer.isActive,
      lastAccess: new Date(swimmer.lastAccess),
      memberNumber: swimmer.memberNumber,
      photoUrl: swimmer.photoUrl,
      Teacher: swimmer.teacherNumber
        ? {
            connect: {
              teacherNumber: swimmer.teacherNumber,
            },
          }
        : undefined,
    };

    return prismaSwimmer;
  }
}
