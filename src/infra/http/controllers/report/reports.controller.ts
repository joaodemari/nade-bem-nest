import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { IsPublic } from '../../decorators/is-public.decorator';
import { PostReportService } from '../../../../domain/services/reports/templates/postReport.service';
import { UseZodGuard } from 'nestjs-zod';
import { postReportBodySchema } from '../../dtos/reports/postReportDTO.dto';

@IsPublic()
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly PostReportService: PostReportService,
    private readonly reportsRepository: ReportsRepository,
  ) {}

  @Get('invalid')
  async deleteInvalid() {
    return await this.reportsRepository.deleteInvalidReports();
  }

  @Post(':reportId')
  @UseZodGuard('body', postReportBodySchema)
  async createReport(
    @Param('reportId') reportId: string,
    @Body() body: postReportBodySchema,
  ) {
    try {
      const { periodId, levelId, steps, observation, memberNumber } = body;
      return await this.PostReportService.handle({
        levelId,
        memberNumber,
        observation,
        steps,
        id: reportId,
        periodId,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException('Erro Interno');
    }
  }
}
