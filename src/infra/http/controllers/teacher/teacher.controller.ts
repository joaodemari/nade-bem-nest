import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { IsPublic } from '../../decorators/is-public.decorator';
import { TeacherService } from '../../../../domain/services/teachers/teacher.service';
import { Role } from '../../../../domain/enums/role.enum';
import { Roles } from '../../decorators/role.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  @Get('reports-count')
  async countReports(
    @Query('periodId') periodId: string,
    @Query('branchId') branchId?: string,
  ) {
    return await this.service.countReports({ periodId, branchId });
  }

  @Roles(Role.admin)
  @Get('table')
  async teachersTable(
    @Query('periodId') periodId: string,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    return await this.service.teachersTable({
      branchId: user.branchId,
      periodId,
    });
  }
}
