import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';
import { PeriodService } from '../../../../domain/services/periods/periods.service';

@Controller('periods')
export class PeriodController {
  constructor(private readonly periodsService: PeriodService) {}

  @Roles(Role.Teacher)
  @Get()
  async findAllByBranch(@CurrentUser() user: AuthPayloadDTO) {
    return await this.periodsService.findAllByBranch(user.branchId);
  }
}
