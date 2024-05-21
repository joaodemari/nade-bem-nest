import { PeriodEntity } from '../../../../domain/entities/PeriodEntity';
import { Prisma, Period as PrismaPeriod } from '@prisma/client';

export class PrismaPeriodsMapper {
  static toDomain(prismaPeriod: PrismaPeriod): PeriodEntity {
    return PeriodEntity.create(
      {
        name: prismaPeriod.name,
        startDate: prismaPeriod.startDate,
        endDate: prismaPeriod.endDate,
      },
      prismaPeriod.id,
    );
  }

  static toPersistence(
    teacher: PeriodEntity,
  ): Prisma.PeriodUncheckedCreateInput {
    return {
      name: teacher.name,
      startDate: teacher.startDate,
      endDate: teacher.endDate,
    };
  }
}
