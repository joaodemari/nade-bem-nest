import { Prisma, Branch as PrismaBranch } from '@prisma/client';
import { BranchEntity } from '../../../../domain/entities/branch-entity';

export class PrismaBranchesMapper {
  static toDomain(prismaReport: PrismaBranch): BranchEntity {
    const report = BranchEntity.create(
      {
        name: prismaReport.name,
        apiKey: prismaReport.apiKey,
      },
      prismaReport.id,
    );

    return report;
  }

  static toPersistence(
    branch: BranchEntity,
  ): Prisma.BranchUncheckedCreateInput {
    const prismaBranch: Prisma.BranchUncheckedCreateInput = {
      name: branch.name,
      apiKey: branch.apiKey,
    };

    return prismaBranch;
  }
}
