import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { GetTemplateReportByLevelController } from '../controllers/report/getLevelTemplate.controller';
import { GetLevelTempleteService } from '../../../domain/services/reports/templates/getLevelTemplate.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GetTemplateReportByLevelController],
  providers: [GetLevelTempleteService],
})
export class LevelModule {}
