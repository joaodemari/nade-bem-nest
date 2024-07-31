import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ReportPDFsByTeacherService } from '../../../../../domain/services/reports/ReportPDFsByTeacher.service';
import { Response } from 'express';

@Controller()
export class ReportPDFsByTeacherController {
  constructor(
    private readonly reportPDFsByTeacherService: ReportPDFsByTeacherService,
  ) {}

  @Get('/teachers/:teacherId/reports/:periodId/pdf')
  async handle(
    @Param('teacherId') teacherId: string,
    @Param('periodId') periodId: string,
    @Res() res: Response,
  ): Promise<Response> {
    console.log(teacherId, periodId);

    try {
      const reports = await this.reportPDFsByTeacherService.execute({
        teacherId,
        periodId,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.set(
        'Content-Disposition',
        `attachment; filename=avaliacoes-2024-1.pdf`,
      );

      return res.end(reports.buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}
