import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { IsPublic } from '../../decorators/is-public.decorator';

@IsPublic()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  @Delete(':id')
  async delete(@Param('id') reportId: string) {
    return await this.reportsRepository.delete(reportId);
  }

  @Get('invalid')
  async deleteInvalid() {
    return await this.reportsRepository.deleteInvalidReports();
  }
}
