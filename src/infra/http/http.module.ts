import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { IntegrationModule } from './modules/integration.module';
import { CheckController } from './controllers/check/check-controller.controller';

@Module({
  imports: [AuthenticationModule, IntegrationModule],
  controllers: [CheckController],
  providers: [],
})
export class HttpModule {}
