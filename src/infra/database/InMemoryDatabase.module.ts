import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SwimmersRepository } from '../../domain/repositories/swimmers-repository';
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
import { InMemorySwimmersRepository } from '../../../tests/repositories/in-memory-swimmers-repository';
import { InMemoryAuthRepository } from '../../../tests/repositories/in-memory-auth-repository';
import { InMemoryAdminRepository } from '../../../tests/repositories/in-memory-admin-repository';
import { AdminsRepository } from '../../domain/repositories/admins-repository';
import { BranchTeacherRepository } from '../../domain/repositories/branch-teacher-repository';
import { InMemoryBranchTeachersRepository } from '../../../tests/repositories/in-memory-branch-Teachers-repository';
import { EnterpriseRepository } from '../../domain/repositories/enterprise-repository';
import { InMemoryEnterpriseRepository } from '../../../tests/repositories/in-memory-enterprises-repository';
import { ResponsibleRepository } from '../../domain/repositories/responsibles-repository';
import { InMemoryResponsibleRepository } from '../../../tests/repositories/in-memory-responsibles-repository';
import { InMemoryTeachersRepository } from '../../../tests/repositories/in-memory-teachers-repository';
import { InMemoryPeriodsRepository } from '../../../tests/repositories/in-memory-periods-repository';
import { InMemoryReportsRepository } from '../../../tests/repositories/in-memory-reports-repository';
import { InMemoryLevelsRepository } from '../../../tests/repositories/in-memory-levels-repository';
import { InMemoryBranchRepository } from '../../../tests/repositories/in-memory-branch-repository';
import { SelectionsRepository } from '../../domain/repositories/selections-repository';
import { InMemorySelectionsRepository } from '../../../tests/repositories/in-memory-selections-repository';
import { SessionsRepository } from '../../domain/repositories/sessions-repository';
import { InMemorySessionsRepository } from '../../../tests/repositories/in-memory-sessions-repository';
@Module({
  providers: [
    EnvService,
    {
      provide: SwimmersRepository,
      useClass: InMemorySwimmersRepository,
    },
    {
      provide: TeachersRepository,
      useClass: InMemoryTeachersRepository,
    },
    {
      provide: PeriodsRepository,
      useClass: InMemoryPeriodsRepository,
    },
    {
      provide: ReportsRepository,
      useClass: InMemoryReportsRepository,
    },
    {
      provide: LevelsRepository,
      useClass: InMemoryLevelsRepository,
    },
    {
      provide: BranchRepository,
      useClass: InMemoryBranchRepository,
    },
    {
      provide: AuthRepository,
      useClass: InMemoryAuthRepository,
    },
    {
      provide: AdminsRepository,
      useClass: InMemoryAdminRepository,
    },
    {
      provide: BranchTeacherRepository,
      useClass: InMemoryBranchTeachersRepository,
    },
    {
      provide: EnterpriseRepository,
      useClass: InMemoryEnterpriseRepository,
    },
    {
      provide: ResponsibleRepository,
      useClass: InMemoryResponsibleRepository,
    },
    {
      provide: SelectionsRepository,
      useClass: InMemorySelectionsRepository,
    },
    {
      provide: SessionsRepository,
      useClass: InMemorySessionsRepository,
    },
  ],
  exports: [
    SessionsRepository,
    SelectionsRepository,
    ResponsibleRepository,
    EnterpriseRepository,
    BranchTeacherRepository,
    AdminsRepository,
    SwimmersRepository,
    TeachersRepository,
    PeriodsRepository,
    ReportsRepository,
    LevelsRepository,
    BranchRepository,
    AuthRepository,
  ],
})
export class InMemoryDatabaseModule {}
