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
import { Role } from '../../../../domain/enums/role.enum';
import { Roles } from '../../decorators/role.decorator';
import { GetReportByIdService } from '../../../../domain/services/reports/getReportById.service';
import { DeleteReportByIdService } from '../../../../domain/services/reports/deleteReportById.service';

@IsPublic()
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly PostReportService: PostReportService,
    private readonly reportsRepository: ReportsRepository,
    private readonly getReportByIdService: GetReportByIdService,
    private readonly deleteReportByIdService: DeleteReportByIdService,
  ) {}

  @IsPublic()
  @Get(':reportId/delete')
  async deleteReport(@Param('reportId') reportId: string) {
    try {
      console.log('deletando');
      await this.deleteReportByIdService.execute(reportId);
      return { message: 'Report deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro Interno');
    }
  }

  @IsPublic()
  @Get('updateByReportSteps')
  async updateByReportSteps() {
    try {
      await this.reportsRepository.updateRightLevelsToReport();
      return { message: 'Report deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro Interno');
    }
  }

  @Delete('invalid')
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

  @Roles(Role.Admin, Role.Teacher, Role.Responsible)
  @Get(':reportId')
  async getReportInformation(@Param('reportId') reportId: string) {
    try {
      const result = await this.getReportByIdService.execute(reportId);
      return result;
    } catch (e) {
      throw new InternalServerErrorException('Erro Interno');
    }
  }
}
