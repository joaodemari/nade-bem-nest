import { BranchTeacher } from '@prisma/client';

export class InMemoryBranchTeachersRepository
  implements BranchTeacherRepository
{
  branchTeachers: BranchTeacher[] = [];

  constructor() {}
  async findManyByTeacherId(teacherId: string): Promise<BranchTeacher[]> {
    return this.branchTeachers.filter((bt) => bt.teacherId === teacherId);
  }
}

export interface BranchTeacherRepository {
  findManyByTeacherId(teacherId: string): Promise<BranchTeacher[]>;
}
