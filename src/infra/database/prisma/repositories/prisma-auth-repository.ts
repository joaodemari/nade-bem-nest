import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthRepository } from '../../../../domain/repositories/auth-repository';
import { Auth } from '@prisma/client';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(
    email: string,
  ): Promise<{ auth: Auth; memberNumber: number | null; branchId: string }> {
    const auth = await this.prisma.auth.findFirst({
      where: {
        email,
      },
      include: {
        teacher: {
          select: {
            teacherNumber: true,
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
      memberNumber: auth.teacher?.teacherNumber ?? null,
      branchId,
    };
  }
}
