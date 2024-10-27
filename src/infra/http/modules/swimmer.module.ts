import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infra/database/database.module';
import { SwimmersController } from '../controllers/swimmer/swimmers.controller';
import { SwimmersService } from '../../../domain/services/swimmers.service';
import { IntegrationModule } from './integration.module';
import { EvoIntegrationService } from '../../../domain/services/integration/evoIntegration.service';

@Module({
  imports: [DatabaseModule, IntegrationModule],
  controllers: [SwimmersController],
  providers: [SwimmersService, EvoIntegrationService],
})
export class SwimmerModule {}
