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

@Roles(Role.Teacher)
@Controller('report-template/last-report')
export class GetTemplateReportBySwimmerController {
  constructor(
    private readonly getTemplateReportBySwimmer: GetRepTemplBySwimmerService,
  ) {}

  @Get(':selectionId')
  async handle(@Param('selectionId') selectionId: string) {
    try {
      const report =
        await this.getTemplateReportBySwimmer.getBySelectionId(selectionId);

      return report;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error getting report template by swimmer',
      );
    }
  }
}
