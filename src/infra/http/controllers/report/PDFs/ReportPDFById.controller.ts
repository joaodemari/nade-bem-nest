import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ReportPDFsByTeacherService } from '../../../../../domain/services/reports/ReportPDFsByTeacher.service';
import { Response } from 'express';
import { GetReportByIdService } from '../../../../../domain/services/reports/getReportById.service';
import { ReportPDFByIdService } from '../../../../../domain/services/reports/ReportPDFById.service';

@Controller()
export class ReportPDFByIdController {
  constructor(private readonly reportPDFByIdService: ReportPDFByIdService) {}

  @Get('/reports/:reportId/pdf')
  async handle(
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const reports = await this.reportPDFByIdService.execute({ reportId });

      res.setHeader('Content-Type', 'application/pdf');
      res.set(
        'Content-Disposition',
        `attachment; filename=avaliacao-de${reports.swimmerName}.pdf`,
      );

      return res.end(reports.buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}
