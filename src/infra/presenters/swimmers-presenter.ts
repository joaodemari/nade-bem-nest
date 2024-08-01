import { SwimmerEntity } from '../../domain/entities/swimmer-entity';
import { swimmerAndPeriod } from '../../domain/services/swimmers.service';

export class SwimmerPresenter {
  static toHTTP(swimmer: SwimmerEntity | SwimmerEntity[] | null) {
    if (!swimmer) return null;
    if (swimmer instanceof Array) {
      return swimmer.map((swimmer) => {
        return {
          id: swimmer.id.toString(),
          memberNumber: swimmer.memberNumber,
          name: swimmer.name,
          photoUrl: swimmer.photoUrl,
          lastAccess: swimmer.lastAccess,
          actualLevel: swimmer.actualLevelName,
          teacherNumber: swimmer.teacherNumber,
          lastReport: swimmer.lastReport,
          lastReportId: swimmer.lastReportId,
          isActive: swimmer.isActive,
        };
      });
    }
    return {
      id: swimmer.id.toString(),
      memberNumber: swimmer.memberNumber,
      name: swimmer.name,
      photoUrl: swimmer.photoUrl,
      lastAccess: swimmer.lastAccess,
      actualLevel: swimmer.actualLevelName,
      teacherNumber: swimmer.teacherNumber,
      lastReport: swimmer.lastReport,
      lastReportId: swimmer.lastReportId,
      isActive: swimmer.isActive,
    };
  }

  static toHTTPSwimmerAndPeriod(
    swimmer: swimmerAndPeriod | swimmerAndPeriod[] | null,
  ) {
    if (!swimmer) return null;
    if (swimmer instanceof Array) {
      return swimmer.map((swimmer) => {
        return {
          id: swimmer.id.toString(),
          memberNumber: swimmer.memberNumber,
          name: swimmer.name,
          photoUrl: swimmer.photoUrl,
          lastAccess: swimmer.lastAccess,
          actualLevel: swimmer.actualLevelName,
          teacherNumber: swimmer.teacherNumber,
          lastReport: swimmer.lastReport,
          lastReportId: swimmer.lastReportId,
          isLastReportFromCurrentPeriod: swimmer.isFromThisPeriod,
          isActive: swimmer.isActive,
        };
      });
    }
    return {
      id: swimmer.id.toString(),
      memberNumber: swimmer.memberNumber,
      name: swimmer.name,
      photoUrl: swimmer.photoUrl,
      lastAccess: swimmer.lastAccess,
      actualLevel: swimmer.actualLevelName,
      teacherNumber: swimmer.teacherNumber,
      lastReport: swimmer.lastReport,
      lastReportId: swimmer.lastReportId,
      isActive: swimmer.isActive,
      isLastReportFromCurrentPeriod: swimmer.isFromThisPeriod,
    };
  }
}
