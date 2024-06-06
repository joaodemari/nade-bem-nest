import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { TeacherService } from '../../../../domain/services/teacher.service';
import { IsPublic } from '../../decorators/is-public.decorator';

@IsPublic()
@Controller('teacher')
export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  @Get('reports-count')
  async countReports(
    @Query('periodId') periodId: string,
    @Query('branchId') branchId?: string,
  ) {
    return await this.service.countReports({ periodId, branchId });
  }
}
