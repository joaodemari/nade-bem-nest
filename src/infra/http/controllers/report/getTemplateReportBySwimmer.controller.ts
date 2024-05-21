import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../../domain/services/reports/templates/getRepTemplBySwimmer.service';

@Controller('report-template')
export class GetTemplateReportBySwimmerController {
  constructor(
    private readonly getTemplateReportBySwimmer: GetRepTemplBySwimmerService,
  ) {}

  @Get('/swimmer/:swimmerId')
  async handle(@Param('swimmerId') swimmerId: string) {
    try {
      const report = await this.getTemplateReportBySwimmer.execute(swimmerId);
      if (!report) {
        throw new BadRequestException('Report not found');
      }
      return report;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting report template by swimmer',
      );
    }
  }
}
