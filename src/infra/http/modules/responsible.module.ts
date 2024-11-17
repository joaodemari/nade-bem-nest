import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SwimmersController } from '../controllers/swimmer/swimmers.controller';
import { SwimmersService } from '../../../domain/services/swimmers.service';
import { IntegrationModule } from './integration.module';
import { EvoIntegrationService } from '../../../domain/services/integration/evoIntegration.service';
import { GetSwimmersByResponsibleUseCase } from '../../../domain/services/responsibles/getSwimmersByResponsibleUseCase.service';
import { ResponsibleController } from '../controllers/Responsible/responsibles.controller';

@Module({
  imports: [DatabaseModule, IntegrationModule],
  controllers: [ResponsibleController],
  providers: [GetSwimmersByResponsibleUseCase],
})
export class ResponsibleModule {}
