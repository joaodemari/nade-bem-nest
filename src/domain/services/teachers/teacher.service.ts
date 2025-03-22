import { Injectable } from '@nestjs/common';
import { Teacher } from '@prisma/client';
import { TeachersTableResponseDto } from '../../../infra/http/dtos/teachers/teacherForAdmin/TeachersTableResponse.dto';
import { TeachersRepository } from '../../repositories/teachers-repository';

@Injectable()
export class TeacherService {
  constructor(private teachersRepository: TeachersRepository) {}

  async getTeachersByBranchId(branchId: string): Promise<Teacher[]> {
    return await this.teachersRepository.getTeachersByBranchId(branchId);
  }

  async countReports({
    periodId,
    branchId,
  }: {
    periodId: string;
    branchId?: string;
  }): Promise<{ teacherId: string; name: string; reports: number }[]> {
    return await this.teachersRepository.countReports({ periodId, branchId });
  }

  async teachersTable({
    branchId,
    periodId,
  }: {
    branchId: string;
    periodId: string;
  }): Promise<TeachersTableResponseDto> {
    const teachersAndInformation =
      await this.teachersRepository.getAllByBranchAndInformation(
        branchId,
        periodId,
      );

    return teachersAndInformation;
  }

  // async SwimmersIdsByTeacher({}:{teacherId: string, branchId: string, periodId: string}): Promise<number[]> {
  //   return await this.teachersRepository.SwimmersIdsByTeacher({teacherId, branchId, periodId});
  // }
}
