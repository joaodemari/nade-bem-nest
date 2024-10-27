import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { GetRepTemplBySwimmerService } from '../../../../domain/services/reports/templates/getRepTemplBySwimmer.service';
import { Role } from '../../../../domain/enums/role.enum';
import { Roles } from '../../decorators/role.decorator';

@Roles(Role.teacher)
@Controller('report-template/last-report')
export class GetTemplateReportBySwimmerController {
  constructor(
    private readonly getTemplateReportBySwimmer: GetRepTemplBySwimmerService,
  ) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    try {
      const reportId = id == 'no-report' ? null : id;
      const report = await this.getTemplateReportBySwimmer.execute(reportId);

      return report;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error getting report template by swimmer',
      );
    }
  }
}
