import { Module } from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../domain/services/reports/templates/getRepTemplBySwimmer.service';
import { DatabaseModule } from '../../database/database.module';
import { GetTemplateReportBySwimmerController } from '../controllers/report/getTemplateReportBySwimmer.controller';
import { ReportsController } from '../controllers/report/reports.controller';
import { PostReportService } from '../../../domain/services/reports/templates/postReport.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GetTemplateReportBySwimmerController, ReportsController],
  providers: [GetRepTemplBySwimmerService, PostReportService],
})
export class ReportModule {}
