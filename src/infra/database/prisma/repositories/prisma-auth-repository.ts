import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthRepository } from '../../../../domain/repositories/auth-repository';
import { Auth } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }

  async findByEmail(email: string): Promise<{ auth: Auth; branchId: string }> {
    const auth = await this.prisma.auth.findFirst({
      where: {
        email,
      },
      include: {
        teacher: {
          select: {
            branchTeachers: {
              include: { branch: { select: { id: true } } },
            },
          },
        },
        admin: {
          include: {
            enterprise: {
              include: {
                branches: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!auth) {
      return null;
    }

    let branchId: string;

    if (auth.teacher?.branchTeachers.length) {
      branchId = auth.teacher.branchTeachers[0].branch.id;
    } else {
      branchId = auth.admin.enterprise.branches[0].id;
    }

    return {
      auth,
      branchId,
    };
  }
}
