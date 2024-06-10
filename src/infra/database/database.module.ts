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
import { LevelsRepository } from '../../domain/repositories/levels-repository';
import { PrismaLevelsRepository } from './prisma/repositories/prisma-levels-repository';
import { EnvService } from '../env/env.service';

@Module({
  providers: [
    PrismaService,
    EnvService,
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
    {
      provide: LevelsRepository,
      useClass: PrismaLevelsRepository,
    },
  ],
  exports: [
    PrismaService,
    SwimmersRepository,
    TeachersRepository,
    PeriodsRepository,
    ReportsRepository,
    LevelsRepository,
  ],
})
export class DatabaseModule {}
