import { ReportEntity } from '../../../../domain/entities/ReportEntity';
import { Report as PrismaReport } from '@prisma/client';

export class PrismaReportsMapper {
  static toDomain(prismaReport: PrismaReport): ReportEntity {
    const report = ReportEntity.create(
      {
        idSwimmer: prismaReport.idSwimmer,
        idTeacher: prismaReport.idTeacher,
        observation: prismaReport.observation,
        approved: prismaReport.approved,
        createdAt: prismaReport.createdAt,
        isAvailable: prismaReport.isAvailable,
        levelId: prismaReport.levelId,
        periodId: prismaReport.periodId,
        branchId: prismaReport.branchId,
      },
      prismaReport.id,
    );

    return report;
  }
}
