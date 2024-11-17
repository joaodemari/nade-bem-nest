import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { IntegrationModule } from './integration.module';
import { EvoIntegrationService } from '../../../domain/services/integration/evoIntegration.service';
import { GetSwimmersByResponsibleUseCase } from '../../../domain/services/responsibles/getSwimmersByResponsibleUseCase.service';
import { ResponsibleController } from '../controllers/Responsible/responsibles.controller';

@Module({
  imports: [DatabaseModule, IntegrationModule],
  controllers: [ResponsibleController],
  providers: [GetSwimmersByResponsibleUseCase, EvoIntegrationService],
})
export class ResponsibleModule {}
