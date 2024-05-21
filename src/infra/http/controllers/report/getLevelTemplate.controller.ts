import { Controller, Get, Param } from '@nestjs/common';
import { GetLevelTempleteService } from '../../../../domain/services/reports/templates/getLevelTemplate.service';

@Controller('report-template')
export class GetTemplateReportByLevelController {
  constructor(
    private readonly getLevelTemplateService: GetLevelTempleteService,
  ) {}

  @Get('/level/:level')
  async handle(@Param('level') level: string) {
    const response = await this.getLevelTemplateService.execute(level);
    return response.value;
  }
}
