import { Module } from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../domain/services/reports/templates/getRepTemplBySwimmer.service';
import { DatabaseModule } from '../../database/database.module';
import { GetTemplateReportBySwimmerController } from '../controllers/report/getTemplateReportBySwimmer.controller';
import { ReportsController } from '../controllers/report/reports.controller';
import { PostReportService } from '../../../domain/services/reports/templates/postReport.service';
import { ReportPDFsByTeacherController } from '../controllers/report/PDFs/ReportPDFsByTeacher.controller';
import { ReportPDFsByTeacherService } from '../../../domain/services/reports/ReportPDFsByTeacher.service';
import { PrintReportService } from '../../../domain/services/reports/PrintReport.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GetTemplateReportBySwimmerController, ReportsController, ReportPDFsByTeacherController],
  providers: [GetRepTemplBySwimmerService, PostReportService, ReportPDFsByTeacherService, PrintReportService],
})
export class ReportModule {}
