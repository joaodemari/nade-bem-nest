import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { IntegrationModule } from './modules/integration.module';
import { CheckController } from './controllers/check/check-controller.controller';
import { LevelModule } from './modules/level.module';
import { ReportModule } from './modules/report.module';
import { TeacherModule } from './modules/teacher.module';

@Module({
  imports: [
    AuthenticationModule,
    IntegrationModule,
    LevelModule,
    ReportModule,
    TeacherModule,
  ],
  controllers: [CheckController],
  providers: [],
})
export class HttpModule {}
