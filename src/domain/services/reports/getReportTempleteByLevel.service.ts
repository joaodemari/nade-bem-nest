import { ReportsRepository } from 'src/domain/repositories/reports-repository';

export class GetReportTempleteByLevelService {
  constructor(private readonly reportRepository: ReportsRepository) {}

  async execute(level: string): Promise<GetReportTempleteByLevelResponse> {
    const report = await this.reportRepository.getReportByLevel(level);
    if (!report) return left(new ResourceNotFound('Report'));
    return right(report);
  }
}
