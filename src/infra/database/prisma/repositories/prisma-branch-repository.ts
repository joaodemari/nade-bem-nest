import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BranchRepository } from '../../../../domain/repositories/branches-repository';
import { Branch, Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaBranchRepository implements BranchRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }
  findManyByEnterpriseId(enterpriseId: string): Promise<Branch[]> {
    throw new Error('Method not implemented.');
  }

  findByUrl(url: string): Promise<Branch> {
    return this.prisma.branch.findFirst({
      where: {
        url: url,
      },
    });
  }
  async getDefaultTeacher(branchId: string): Promise<number> {
    return 4;
  }

  async createBranch(branch: Prisma.BranchCreateInput): Promise<Branch> {
    const inPrisma = await this.prisma.branch.create({ data: branch });
    return inPrisma;
  }

  async getBranchToken(branchId: string): Promise<string> {
    const branch = await this.prisma.branch.findFirst({
      where: {
        id: branchId,
      },
      select: {
        apiKey: true,
      },
    });

    return branch.apiKey;
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
