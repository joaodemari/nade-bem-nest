import { IRepository } from '../../core/generic/I-repository';
import { TeacherEntity } from '../entities/TeacherEntity';

export abstract class TeachersRepository extends IRepository<TeacherEntity> {
  abstract generateToken(id: number): Promise<string>;
  abstract findByEmail(teacherEmail: string): Promise<TeacherEntity | null>;
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
}
