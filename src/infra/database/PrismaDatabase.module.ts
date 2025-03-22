import { forwardRef, Module } from '@nestjs/common';
import {
  PrismaService,
  PrismaServiceWithExtensions,
} from './prisma/prisma.service';
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
import { PrismaResponsiblesRepository } from './prisma/repositories/prisma-responsibles-repository';
import { ResponsibleRepository } from '../../domain/repositories/responsibles-repository';
import { SelectionsRepository } from '../../domain/repositories/selections-repository';
import { PrismaSelectionsRepository } from './prisma/repositories/prisma-selections-repository';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from './prisma/prisma.extension';
import { SessionsRepository } from '../../domain/repositories/sessions-repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository';

export const PRISMA_INJECTION_TOKEN = 'PrismaService';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: PRISMA_INJECTION_TOKEN,
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
  ],
  providers: [
    EnvService,
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
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
    {
      provide: ResponsibleRepository,
      useClass: PrismaResponsiblesRepository,
    },
    {
      provide: SelectionsRepository,
      useClass: PrismaSelectionsRepository,
    },
  ],
  exports: [
    SwimmersRepository,
    TeachersRepository,
    PeriodsRepository,
    ReportsRepository,
    LevelsRepository,
    BranchRepository,
    AuthRepository,
    ResponsibleRepository,
    SelectionsRepository,
    SessionsRepository,
  ],
})
export class PrismaDatabaseModule {}
