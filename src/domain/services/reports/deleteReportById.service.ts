import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../../repositories/reports-repository';
import { Area, Level, Report, Step } from '@prisma/client';

@Injectable()
export class DeleteReportByIdService {
  constructor(private readonly reportRepository: ReportsRepository) {}

  async execute(reportId: string) {
    const report = await this.reportRepository.deleteReportById(reportId);
    return report;
  }
}
