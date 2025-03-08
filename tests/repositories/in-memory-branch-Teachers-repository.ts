import { BranchTeacher } from '@prisma/client';
import { BranchTeacherRepository } from '../../src/domain/repositories/branch-teacher-repository';
import { branchTeachersDummyDB } from './dummyDB';

export class InMemoryBranchTeachersRepository
  implements BranchTeacherRepository
{
  branchTeachers: BranchTeacher[] = branchTeachersDummyDB;

  constructor() {}
  async findManyByTeacherId(teacherId: string): Promise<BranchTeacher[]> {
    return this.branchTeachers.filter((bt) => bt.teacherId === teacherId);
  }
}
