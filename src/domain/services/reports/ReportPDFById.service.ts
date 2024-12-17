import { Injectable } from '@nestjs/common';
import { PrintReportService } from './PrintReport.service';
import { ReportsRepository } from '../../repositories/reports-repository';
import capitalizeName from '../../../core/utils/capitalizeName';
import nameToUrl from '../../../core/utils/name-to-url';
const pdfDocument = require('pdfkit-table');

@Injectable()
export class ReportPDFByIdService {
  constructor(
    private readonly printReportService: PrintReportService,
    private readonly reportRepository: ReportsRepository,
  ) {}

  async execute({
    reportId,
  }: {
    reportId: string;
  }): Promise<{ buffer: Buffer; swimmerName: string }> {
    const report = await this.reportRepository.findOneById({
      reportId,
    });

    if (!report) {
      throw new Error('No reports with the filters');
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

    this.printReportService.execute({ doc, report });

    doc.end();

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });

    console.log('pdf created');

    return { buffer: buffer, swimmerName: '' };
  }
}
