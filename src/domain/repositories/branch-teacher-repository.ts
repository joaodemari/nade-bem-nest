import { BranchTeacher } from "@prisma/client";

export abstract class BranchTeacherRepository {
  abstract findManyByTeacherId(teacherId: string): Promise<BranchTeacher[]>;
}
