import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { IntegrationModule } from './modules/integration.module';
import { CheckController } from './controllers/check/check-controller.controller';
import { LevelModule } from './modules/level.module';
import { ReportModule } from './modules/report.module';

@Module({
  imports: [AuthenticationModule, IntegrationModule, LevelModule, ReportModule],
  controllers: [CheckController],
  providers: [],
})
export class HttpModule {}
