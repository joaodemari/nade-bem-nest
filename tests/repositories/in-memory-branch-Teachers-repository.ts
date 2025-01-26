import { BranchTeacher } from '@prisma/client';
import { BranchTeacherRepository } from '../../src/domain/repositories/branch-teacher-repository';

export class InMemoryBranchTeachersRepository
  implements BranchTeacherRepository
{
  branchTeachers: BranchTeacher[] = [];

  constructor() {}
  async findManyByTeacherId(teacherId: string): Promise<BranchTeacher[]> {
    return this.branchTeachers.filter((bt) => bt.teacherId === teacherId);
  }
}
