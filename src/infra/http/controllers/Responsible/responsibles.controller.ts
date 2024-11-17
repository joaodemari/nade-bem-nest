import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { SwimmersService } from '../../../../domain/services/swimmers.service';
import {
  ListAllSwimmersQueryDTO,
  ListAllSwimmersQuerySchema,
  ListSwimmersQueryDTO,
  ListSwimmersQuerySchema,
} from '../../dtos/ListSwimmers.dto';
import { PeriodPresenter } from '../../../presenters/periods-presenter';
import { SwimmerPresenter } from '../../../presenters/swimmers-presenter';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';
import { UseZodGuard } from 'nestjs-zod';
import { SwimmerInfoResponse } from '../../dtos/swimmers/swimmerInfo.dto';
import { IsPublic } from '../../decorators/is-public.decorator';
import { Swimmer } from '@prisma/client';
import { GetSwimmersByResponsibleUseCase } from '../../../../domain/services/responsibles/getSwimmersByResponsibleUseCase.service';
import { SwimmerWithPeriod } from '../../../../domain/repositories/responsibles-repository';
import { EvoIntegrationService } from '../../../../domain/services/integration/evoIntegration.service';

@Controller('responsibles')
export class ResponsibleController {
  constructor(
    private readonly getSwimmersByResponsibleUseCase: GetSwimmersByResponsibleUseCase,
    private readonly evoIntegrationService: EvoIntegrationService,
  ) {}
  @Get('swimmers')
  @Roles(Role.Teacher, Role.Admin, Role.Responsible)
  async findSwimmerInfo(
    @CurrentUser() user: AuthPayloadDTO,
  ): Promise<SwimmerWithPeriod[]> {
    try {
      const result = await this.getSwimmersByResponsibleUseCase.execute(
        user.authId,
      );
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @IsPublic()
  @Get('reset-password')
  async getResetPasswordLink(
    @Query('email') email: string,
    @Query('branchId') branchId: string,
  ) {
    try {
      const result = await this.evoIntegrationService.getResetPasswordLink({
        email,
        branchId,
      });

      console.log(result);
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
