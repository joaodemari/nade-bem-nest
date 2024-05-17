import { Controller, Get, Param } from '@nestjs/common';

@Controller('report-template')
export class GetTemplateReportByLevelController {
  constructor(
    private readonly getTemplateReportByLevelService: GetTemplateReportByLevelService,
  ) {}

  @Get('/level/:level')
  async handle(@Param('level') level: string): Promise<HttpResponse> {
    const response = await this.getTemplateReportByLevelService.execute(level);
    return ok(response);
  }
}
