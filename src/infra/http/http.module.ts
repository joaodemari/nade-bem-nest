import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { IntegrationModule } from './modules/integration.module';
import { CheckController } from './controllers/check/check-controller.controller';
import { LevelModule } from './modules/level.module';
import { ReportModule } from './modules/report.module';
import { TeacherModule } from './modules/teacher.module';
import { BranchModule } from './modules/branch.module';
import { PeriodModule } from './modules/periods.module';
import { SwimmerModule } from './modules/swimmer.module';
import { ResponsibleModule } from './modules/responsible.module';

@Module({
  imports: [
    AuthenticationModule,
    IntegrationModule,
    LevelModule,
    ReportModule,
    TeacherModule,
    BranchModule,
    PeriodModule,
    SwimmerModule,
    ResponsibleModule,
  ],
  controllers: [CheckController],
  providers: [],
})
export class HttpModule {}
