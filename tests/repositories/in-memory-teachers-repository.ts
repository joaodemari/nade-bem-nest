import { Injectable } from '@nestjs/common';
import { Teacher } from '@prisma/client';
import { TeachersRepository } from '../../src/domain/repositories/teachers-repository';
import { TeachersTableResponseDto } from '../../src/infra/http/dtos/teachers/teacherForAdmin/TeachersTableResponse.dto';

@Injectable()
export class InMemoryTeachersRepository implements TeachersRepository {
  teachers: Teacher[] = [];

  constructor() {}
  getTeachersByBranchId(branchId: string): Promise<Teacher[]> {
    throw new Error('Method not implemented.');
  }
  async findByAuthId(authId: string): Promise<Teacher | null> {
    return this.teachers.find((teacher) => teacher.authId === authId);
  }
  generateToken(teacherAuthId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  findByEmail(
    teacherEmail: string,
  ): Promise<{ teacher: Teacher; branchApiKey: string } | null> {
    throw new Error('Method not implemented.');
  }
  updatePassword(teacherEmail: string, newPassword: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByResetToken(token: string): Promise<Teacher | null> {
    throw new Error('Method not implemented.');
  }
  checkEmailAndPass(email: string, password: string): Promise<Teacher | null> {
    throw new Error('Method not implemented.');
  }
  countReports(props: {
    periodId: string;
    branchId?: string;
  }): Promise<{ teacherId: string; name: string; reports: number }[]> {
    throw new Error('Method not implemented.');
  }
  getAllByBranchAndInformation(
    branchId: string,
    periodId: string,
  ): Promise<TeachersTableResponseDto> {
    throw new Error('Method not implemented.');
  }
}
