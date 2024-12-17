import { Module } from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../domain/services/reports/templates/getRepTemplBySwimmer.service';
import { DatabaseModule } from '../../database/database.module';
import { GetTemplateReportBySwimmerController } from '../controllers/report/getTemplateReportBySwimmer.controller';
import { ReportsController } from '../controllers/report/reports.controller';
import { PostReportService } from '../../../domain/services/reports/templates/postReport.service';
import { ReportPDFsByTeacherController } from '../controllers/report/PDFs/ReportPDFsByTeacher.controller';
import { ReportPDFsByTeacherService } from '../../../domain/services/reports/ReportPDFsByTeacher.service';
import { PrintReportService } from '../../../domain/services/reports/PrintReport.service';
import { GetReportByIdService } from '../../../domain/services/reports/getReportById.service';
import { DeleteReportByIdService } from '../../../domain/services/reports/deleteReportById.service';
import { ReportPDFByIdService } from '../../../domain/services/reports/ReportPDFById.service';
import { ReportPDFByIdController } from '../controllers/report/PDFs/ReportPDFById.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    GetTemplateReportBySwimmerController,
    ReportsController,
    ReportPDFsByTeacherController,
    ReportPDFByIdController,
  ],
  providers: [
    GetReportByIdService,
    GetRepTemplBySwimmerService,
    PostReportService,
    ReportPDFsByTeacherService,
    PrintReportService,
    DeleteReportByIdService,
    ReportPDFByIdService,
  ],
})
export class ReportModule {}
