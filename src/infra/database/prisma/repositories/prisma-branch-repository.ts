import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from './prisma-base-repository';
import { PrismaService } from '../prisma.service';
import { BranchEntity } from '../../../../domain/entities/branch-entity';
import { BranchRepository } from '../../../../domain/repositories/branches-repository';
import { Branch, Prisma } from '@prisma/client';

@Injectable()
export class PrismaBranchRepository implements BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBranch(branch: Prisma.BranchCreateInput): Promise<Branch> {
    const inPrisma = await this.prisma.branch.create({ data: branch });
    return inPrisma;
  }

  async getBranchesByAuthId(authId: string): Promise<Branch[]> {
    const branches = await this.prisma.branch.findMany({
      where: {
        branchTeachers: {
          some: {
            teacher: {
              authId,
            },
          },
        },
      },
    });

    return branches;
  }
}
