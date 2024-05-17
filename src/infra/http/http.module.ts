import { Module } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { IntegrationModule } from './modules/integration.module';

@Module({
  imports: [AuthenticationModule, IntegrationModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
