import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '../../../../domain/enums/role.enum';
import { TeacherService } from '../../../../domain/services/teachers/teacher.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/role.decorator';
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

  @Roles(Role.Admin)
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

  @Roles(Role.Admin)
  @Get()
  async getTeachersByBranch(@CurrentUser() user: AuthPayloadDTO) {
    return await this.service.getTeachersByBranchId(user.branchId);
  }
}
