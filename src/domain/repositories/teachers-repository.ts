import { Teacher } from '@prisma/client';
import { TeachersTableResponseDto } from '../../infra/http/dtos/teachers/teacherForAdmin/TeachersTableResponse.dto';

export abstract class TeachersRepository {
  abstract getTeachersByBranchId(branchId: string): Promise<Teacher[]>;
  abstract findByAuthId(authId: string): Promise<Teacher | null>;
  abstract generateToken(id: number): Promise<string>;
  abstract findByEmail(
    teacherEmail: string,
  ): Promise<{ teacher: Teacher; branchApiKey: string } | null>;
  abstract updatePassword(
    teacherEmail: string,
    newPassword: string,
  ): Promise<void>;
  abstract findByResetToken(token: string): Promise<Teacher | null>;
  abstract checkEmailAndPass(
    email: string,
    password: string,
  ): Promise<Teacher | null>;
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
  // abstract SwimmersIdsByTeacher(props: {
  //   teacherId: string;
  //   branchId: string;
  //   periodId: string;
  // }): Promise<{
  //   swimmers: [
  //     {
  //       swimmerId: number;
  //       swimmerName: string;
  //       swimmerNumber: number;
  //     },
  //   ];
  // }>;

  abstract getAllByBranchAndInformation(
    branchId: string,
    periodId: string,
  ): Promise<TeachersTableResponseDto>;
}
