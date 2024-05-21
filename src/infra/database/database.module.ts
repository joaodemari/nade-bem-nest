import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SwimmersRepository } from '../../domain/repositories/swimmers-repository';
import { PrismaSwimmersRepository } from './prisma/repositories/prisma-swimmers-repository';
import { TeachersRepository } from '../../domain/repositories/teachers-repository';
import { PrismaTeachersRepository } from './prisma/repositories/prisma-teachers-repository';
import PeriodsRepository from '../../domain/repositories/periods-repository';
import { PrismaPeriodsRepository } from './prisma/repositories/prisma-periods-repository';
import { ReportsRepository } from '../../domain/repositories/reports-repository';
import { PrismaReportsRepository } from './prisma/repositories/prisma-reports-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: SwimmersRepository,
      useClass: PrismaSwimmersRepository,
    },
    {
      provide: TeachersRepository,
      useClass: PrismaTeachersRepository,
    },
    {
      provide: PeriodsRepository,
      useClass: PrismaPeriodsRepository,
    },
    {
      provide: ReportsRepository,
      useClass: PrismaReportsRepository,
    },
  ],
  exports: [
    PrismaService,
    SwimmersRepository,
    TeachersRepository,
    PeriodsRepository,
    ReportsRepository,
  ],
})
export class DatabaseModule {}
