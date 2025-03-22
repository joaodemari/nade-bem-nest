import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SelectionController } from '../controllers/selection/selection.controller';
import { SelectionService } from '../../../domain/services/selection/selection.service';
import { SelectionSwimmersController } from '../controllers/swimmer/selection-swimmers/selection-swimmers.controller';
import { EvoIntegrationService } from '../../../domain/services/integration/evoIntegration.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SelectionController, SelectionSwimmersController],
  providers: [SelectionService, EvoIntegrationService],
})
export class SelectionModule {}
