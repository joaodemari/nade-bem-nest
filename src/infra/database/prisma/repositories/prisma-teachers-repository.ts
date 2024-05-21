import { TeachersRepository } from '../../../../domain/repositories/teachers-repository';
import { randomUUID } from 'crypto';
import { TeacherEntity } from '../../../../domain/entities/TeacherEntity';
import { PrismaTeachersMapper } from '../mappers/prisma-teacher-mapper';
import { PrismaBaseRepository } from './prisma-base-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTeachersRepository
  extends PrismaBaseRepository<TeacherEntity>
  implements TeachersRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'teacher');
  }
  async checkEmailAndPass(
    email: string,
    password: string,
  ): Promise<TeacherEntity | null> {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!teacher) {
      return null;
    }

    return PrismaTeachersMapper.toDomain(teacher);
  }

  async findByResetToken(token: string): Promise<TeacherEntity | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        resetToken: token,
      },
    });

    if (!teacher) {
      return null;
    }

    return PrismaTeachersMapper.toDomain(teacher);
  }

  async findByEmail(teacherEmail: string): Promise<TeacherEntity | null> {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        email: teacherEmail,
      },
    });

    if (!teacher) {
      return null;
    }

    return PrismaTeachersMapper.toDomain(teacher);
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
}
