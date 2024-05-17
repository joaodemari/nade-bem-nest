import { TeacherEntity } from 'src/domain/entities/TeacherEntity';
import { Prisma, Teacher as PrismaTeacher } from '@prisma/client';

export class PrismaTeachersMapper {
  static toDomain(prismaTeacher: PrismaTeacher): TeacherEntity {
    const teacher = TeacherEntity.create(
      {
        name: prismaTeacher.name,
        email: prismaTeacher.email,
        password: prismaTeacher.password ?? null,
        resetToken: prismaTeacher.resetToken ?? null,
        photoUrl: prismaTeacher.photoUrl ?? null,
        teacherNumber: prismaTeacher.teacherNumber ?? null,
      },
      prismaTeacher.id,
    );

    return teacher;
  }

  static toPersistence(
    teacher: TeacherEntity,
  ): Prisma.TeacherUncheckedCreateInput {
    const prismaTeacher: Prisma.TeacherCreateInput = {
      name: teacher.name,
      email: teacher.email,
      password: teacher.password ?? null,
      resetToken: teacher.resetToken ?? null,
      photoUrl: teacher.photoUrl ?? null,
      teacherNumber: teacher.teacherNumber ?? null,
    };

    return prismaTeacher;
  }
}
