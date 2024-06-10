import { SwimmerEntity } from '../../entities/swimmer-entity';
import { SwimmerEvo } from '../entities/swimmer-evo-entity';

export class SwimmerEvoMapper {
  static toDomain(swimmerEvo: SwimmerEvo) {
    return SwimmerEntity.create({
      actualLevelName: 'Lambari',
      isActive: !swimmerEvo.accessBlocked,
      lastAccess: swimmerEvo.lastAccessDate,
      memberNumber: swimmerEvo.idMember,
      name: swimmerEvo.firstName + ' ' + swimmerEvo.lastName,
      photoUrl: swimmerEvo.photoUrl,
      teacherNumber: swimmerEvo.idEmployeeInstructor,
    });
  }
}
