import { ResponsibleEntity } from 'src/domain/entities/ResponsibleEntity';
import { Prisma, Responsible as PrismaResponsible } from '@prisma/client';

export class PrismaResponsiblesMapper {
  static toDomain(prismaResponsible: PrismaResponsible): ResponsibleEntity {
    const reesponsible = ResponsibleEntity.create(
      {
        email: prismaResponsible.email,
        password: prismaResponsible.password ?? null,
        resetToken: prismaResponsible.resetToken ?? null,
      },
      prismaResponsible.id,
    );

    return reesponsible;
  }

  static toPersistence(
    reesponsible: ResponsibleEntity,
  ): Prisma.ResponsibleUncheckedCreateInput {
    const prismaResponsible: Prisma.ResponsibleCreateInput = {
      email: reesponsible.email,
      password: reesponsible.password ?? null,
      resetToken: reesponsible.resetToken ?? null,
    };

    return prismaResponsible;
  }
}
