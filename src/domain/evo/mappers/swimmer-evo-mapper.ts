import { Prisma } from '@prisma/client';
import { SwimmerEvo } from '../entities/swimmer-evo-entity';

export class SwimmerEvoMapper {
  static toPersistence(swimmerEvo: SwimmerEvo): Prisma.SwimmerCreateInput {
    return {
      actualLevel: {
        connect: {
          name: 'Lambari',
        },
      },
      isActive: !swimmerEvo.accessBlocked,
      lastAccess: swimmerEvo.lastAccessDate,
      memberNumber: swimmerEvo.idMember,
      name: swimmerEvo.firstName + ' ' + swimmerEvo.lastName,
      photoUrl: swimmerEvo.photoUrl,
      Teacher: {
        connect: {
          teacherNumber: swimmerEvo.idEmployeeInstructor,
        },
      },
      Branch: {
        connect: {
          id: swimmerEvo.branchId,
        },
      },
    };
  }
}
