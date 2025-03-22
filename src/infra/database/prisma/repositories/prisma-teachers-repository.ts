import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma, Teacher } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CustomPrismaService } from 'nestjs-prisma';
import { TeachersRepository } from '../../../../domain/repositories/teachers-repository';
import { TeachersTableResponseDto } from '../../../http/dtos/teachers/teacherForAdmin/TeachersTableResponse.dto';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaTeachersRepository implements TeachersRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }
  getTeachersByBranchId(branchId: string): Promise<Teacher[]> {
    return this.prisma.teacher.findMany({
      where: {
        active: true,
        branchTeachers: {
          some: {
            branchId,
          },
        },
      },
    });
  }

  findByAuthId(authId: string): Promise<Teacher | null> {
    throw new Error('Method not implemented.');
  }

  async countReports({
    periodId,
    branchId,
  }: {
    periodId: string;
    branchId?: string;
  }): Promise<{ teacherId: number; name: string; reports: number }[]> {
    const where: Prisma.TeacherWhereInput = branchId
      ? { branchTeachers: { some: { branchId } } }
      : {};

    const teachers = await this.prisma.teacher.findMany({
      where,
      include: {
        swimmers: {
          include: {
            Report: {
              where: {
                periodId,
              },
            },
          },
        },
      },
    });

    const teachersMapped = teachers.map((teacher) => ({
      teacherId: teacher.teacherNumber,
      name: teacher.name,
      reports: teacher.swimmers.reduce(
        (acc, swimmer) => acc + swimmer.Report.length,
        0,
      ),
    }));
    console.log('ta atualizado papai cricket: ', teachersMapped);

    return teachersMapped;
  }
  async checkEmailAndPass(
    email: string,
    password: string,
  ): Promise<Teacher | null> {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async findByResetToken(token: string): Promise<Teacher | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        resetToken: token,
      },
    });

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async findByEmail(
    teacherEmail: string,
  ): Promise<{ teacher: Teacher; branchApiKey: string } | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        email: teacherEmail,
      },
      include: {
        branchTeachers: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!teacher) {
      return null;
    }

    return {
      teacher,
      branchApiKey: teacher.branchTeachers[0].branch.apiKey,
    };
  }

  async updatePassword(token: string, newPassword: string): Promise<void> {
    await this.prisma.teacher.update({
      where: {
        resetToken: token,
      },
      data: {
        password: newPassword,
      },
    });
  }

  async generateToken(id: number): Promise<string> {
    const token = randomUUID();
    await this.prisma.teacher.update({
      where: {
        teacherNumber: id,
      },
      data: {
        resetToken: token,
      },
    });
    return token;
  }

  async getAllByBranchAndInformation(
    branchId: string,
    periodId: string,
  ): Promise<TeachersTableResponseDto> {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        branchTeachers: {
          some: {
            branchId,
          },
        },
      },
      include: {
        swimmers: {
          include: {
            Report: {
              where: {
                periodId,
              },
            },
          },
        },
      },
    });

    const result: TeachersTableResponseDto = {
      content: teachers.map((teacher) => ({
        id: teacher.id,
        teacherAuthId: teacher.authId,
        teacherNumber: teacher.teacherNumber,
        name: teacher.name,
        email: teacher.email,
        activeSwimmers: teacher.swimmers.filter((s) => s.isActive).length,
        totalSwimmers: teacher.swimmers.length,
        totalReports: teacher.swimmers.filter((s) => s.Report.length > 0)
          .length,
      })),
    };

    return result;
  }
}
