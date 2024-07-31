import { Injectable } from '@nestjs/common';
import { PrintReportService } from './PrintReport.service';
import { ReportsRepository } from '../../repositories/reports-repository';
const pdfDocument = require('pdfkit-table');

@Injectable()
export class ReportPDFsByTeacherService {
  constructor(
    private readonly printReportService: PrintReportService,
    private readonly reportRepository: ReportsRepository,
  ) {}

  async execute({
    teacherId,
    periodId,
  }: {
    teacherId: string;
    periodId: string;
  }): Promise<{ buffer: Buffer }> {
    const reports = await this.reportRepository.findManyByTeacher({
      teacherId,
      periodId,
    });

    if (!reports || reports.length === 0) {
      throw new Error('zero reports with the filters');
    }

    const doc = new pdfDocument({
      size: 'A4',
      margins: {
        top: 75,
        bottom: 50,
        left: 50,
        right: 50,
      },
      info: {
        Title: 'Relatório de acompanhamento',
      },
    });

    for (let i = 0; i < reports.length; i++) {
      this.printReportService.execute({ doc, report: reports[i] });

      if (i < reports.length - 1) doc.addPage();
    }

    doc.end();

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });

    console.log('pdf created');

    return { buffer: buffer };
  }
}
