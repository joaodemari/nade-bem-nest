import { Module } from '@nestjs/common';
import { PeriodService } from '../../../domain/services/periods/periods.service';
import { DatabaseModule } from '../../database/database.module';
import { PeriodController } from '../controllers/period/period.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PeriodController],
  providers: [PeriodService],
})
export class PeriodModule {}
