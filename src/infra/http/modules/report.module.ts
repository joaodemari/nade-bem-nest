import { Module } from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../domain/services/reports/templates/getRepTemplBySwimmer.service';
import { DatabaseModule } from '../../database/database.module';
import { GetTemplateReportBySwimmerController } from '../controllers/report/getTemplateReportBySwimmer.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GetTemplateReportBySwimmerController],
  providers: [GetRepTemplBySwimmerService],
})
export class ReportModule {}
