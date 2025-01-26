import { Prisma, Swimmer } from '@prisma/client';
import { SwimmerEvo } from '../entities/swimmer-evo-entity';

export class SwimmerEvoMapper {
  static toPersistence(
    swimmerEvo: SwimmerEvo,
    branchId: string,
    teacherId?: string,
  ): Prisma.SwimmerCreateInput {
    return {
      memberNumberStr: swimmerEvo.idMember.toString(),
      actualLevel: {
        connect: {
          name: 'Lambari',
        },
      },
      isActive: !swimmerEvo.accessBlocked,
      lastAccess: new Date(swimmerEvo.lastAccessDate),
      memberNumber: swimmerEvo.idMember,
      name: swimmerEvo.firstName + ' ' + swimmerEvo.lastName,
      photoUrl: swimmerEvo.photoUrl,
      Teacher: {
        connect: {
          id: teacherId,
        },
      },
      Branch: {
        connect: {
          id: branchId,
        },
      },
    };
  }

  static updateInPersistence(
    swimmerEvo: SwimmerEvo,
    branchId: string,
    teacherId?: string,
  ): Prisma.SwimmerUpdateInput {
    return {
      isActive: !swimmerEvo.accessBlocked,
      lastAccess: new Date(swimmerEvo.lastAccessDate),
      memberNumber: swimmerEvo.idMember,
      name: swimmerEvo.firstName + ' ' + swimmerEvo.lastName,
      photoUrl: swimmerEvo.photoUrl,
      Teacher: {
        connect: {
          id: teacherId,
        },
      },
      Branch: {
        connect: {
          id: branchId,
        },
      },
    };
  }
}
