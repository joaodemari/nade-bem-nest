import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthRepository } from '../../../../domain/repositories/auth-repository';
import { Auth } from '@prisma/client';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(
    email: string,
  ): Promise<{ auth: Auth; memberNumber: number | null }> {
    const auth = await this.prisma.auth.findFirst({
      where: {
        email,
      },
      include: {
        teacher: { select: { teacherNumber: true } },
      },
    });

    if (!auth) {
      return null;
    }

    return { auth, memberNumber: auth.teacher?.teacherNumber ?? null };
  }
}
