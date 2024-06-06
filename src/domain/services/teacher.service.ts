import { Injectable } from '@nestjs/common';
import { TeachersRepository } from '../repositories/teachers-repository';

@Injectable()
export class TeacherService {
  constructor(private teachersRepository: TeachersRepository) {}

  async countReports({
    periodId,
    branchId,
  }: {
    periodId: string;
    branchId?: string;
  }): Promise<{ teacherId: number; name: string; reports: number }[]> {
    return await this.teachersRepository.countReports({ periodId, branchId });
  }
}
