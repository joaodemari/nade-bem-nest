import { Teacher } from '@prisma/client';
import { IRepository } from '../../core/generic/I-repository';
import { TeacherEntity } from '../entities/TeacherEntity';
import { TeachersTableResponseDto } from '../../infra/http/dtos/teachers/teacherForAdmin/TeachersTableResponse.dto';

export abstract class TeachersRepository extends IRepository<TeacherEntity> {
  abstract generateToken(id: number): Promise<string>;
  abstract findByEmail(
    teacherEmail: string,
  ): Promise<{ teacher: TeacherEntity; branchApiKey: string } | null>;
  abstract updatePassword(
    teacherEmail: string,
    newPassword: string,
  ): Promise<void>;
  abstract findByResetToken(token: string): Promise<TeacherEntity | null>;
  abstract checkEmailAndPass(
    email: string,
    password: string,
  ): Promise<TeacherEntity | null>;
  abstract countReports(props: {
    periodId: string;
    branchId?: string;
  }): Promise<
    {
      teacherId: number;
      name: string;
      reports: number;
    }[]
  >;

  abstract getAllByBranchAndInformation(
    branchId: string,
    periodId: string,
  ): Promise<TeachersTableResponseDto>;
}
