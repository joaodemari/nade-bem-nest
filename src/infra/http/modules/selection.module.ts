import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SelectionController } from '../controllers/selection/selection.controller';
import { SelectionService } from '../../../domain/services/selection/selection.service';
import { SelectionSwimmersController } from '../controllers/swimmer/selection-swimmers/selection-swimmers.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SelectionController, SelectionSwimmersController],
  providers: [SelectionService],
})
export class SelectionModule {}
