import { Swimmer } from '@prisma/client';
import { swimmerAndReport } from '../../domain/services/swimmers.service';

export class SwimmerPresenter {
  static toHTTP(swimmer: Swimmer | Swimmer[] | null) {
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
          teacherId: swimmer.id,
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
      teacherId: swimmer.id,
      lastReport: swimmer.lastReport,
      lastReportId: swimmer.lastReportId,
      isActive: swimmer.isActive,
    };
  }

  static toHTTPSwimmerAndPeriod(
    swimmer: swimmerAndReport | swimmerAndReport[] | null,
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
          teacherId: swimmer.id,
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
      teacherId: swimmer.id,
      lastReport: swimmer.lastReport,
      lastReportId: swimmer.lastReportId,
      isActive: swimmer.isActive,
      isLastReportFromCurrentPeriod: swimmer.isFromThisPeriod,
    };
  }
}
