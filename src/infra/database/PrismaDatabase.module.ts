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
import { BranchRepository } from '../../domain/repositories/branches-repository';
import { PrismaBranchRepository } from './prisma/repositories/prisma-branch-repository';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { PrismaAuthRepository } from './prisma/repositories/prisma-auth-repository';

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
    {
      provide: BranchRepository,
      useClass: PrismaBranchRepository,
    },
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [
    PrismaService,
    SwimmersRepository,
    TeachersRepository,
    PeriodsRepository,
    ReportsRepository,
    LevelsRepository,
    BranchRepository,
    AuthRepository,
  ],
})
export class PrismaDatabaseModule {}
