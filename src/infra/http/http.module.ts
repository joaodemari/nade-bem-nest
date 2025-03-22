import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CheckController } from './controllers/check/check-controller.controller';
import { AuthenticationModule } from './modules/authentication.module';
import { BranchModule } from './modules/branch.module';
import { IntegrationModule } from './modules/integration.module';
import { LevelModule } from './modules/level.module';
import { PeriodModule } from './modules/periods.module';
import { ReportModule } from './modules/report.module';
import { ResponsibleModule } from './modules/responsible.module';
import { SelectionModule } from './modules/selection.module';
import { SessionsModule } from './modules/sessions.module';
import { SwimmerModule } from './modules/swimmer.module';
import { TeacherModule } from './modules/teacher.module';

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
    SelectionModule,
    SessionsModule,
    DatabaseModule,
  ],
  controllers: [CheckController],
  providers: [],
})
export class HttpModule {}
