import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from './prisma-base-repository';
import { PrismaService } from '../prisma.service';
import { BranchEntity } from '../../../../domain/entities/branch-entity';
import { BranchRepository } from '../../../../domain/repositories/branches-repository';
import { PrismaBranchesMapper } from '../mappers/prisma-branch-mapper';

@Injectable()
export class PrismaBranchRepository
  extends PrismaBaseRepository<BranchEntity>
  implements BranchRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'branch');
  }

  async createBranch(branch: BranchEntity): Promise<BranchEntity> {
    const data = PrismaBranchesMapper.toPersistence(branch);
    const inPrisma = await this.prisma.branch.create({ data });
    return PrismaBranchesMapper.toDomain(inPrisma);
  }

  async updateBranchSwimmers(branchId: string): Promise<void> {
    await this.prisma.teacher.updateMany({
      data: {
        branchId,
      },
    });
  }
}
