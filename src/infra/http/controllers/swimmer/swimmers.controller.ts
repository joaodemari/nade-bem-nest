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
import { PeriodPresenter } from '../../../../infra/presenters/periods-presenter';
import { SwimmerPresenter } from '../../../../infra/presenters/swimmers-presenter';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';
import { UseZodGuard } from 'nestjs-zod';
import { SwimmerInfoResponse } from '../../dtos/swimmers/swimmerInfo.dto';
import { IsPublic } from '../../decorators/is-public.decorator';
import { SwimmersRepository } from '../../../../domain/repositories/swimmers-repository';

@Controller('swimmers')
export class SwimmersController {
  constructor(
    private readonly swimmerService: SwimmersService,
    private readonly swimmersRepo: SwimmersRepository,
  ) {}


  @Get()
  @Roles(Role.Teacher, Role.Admin)
  @UseZodGuard('query', ListSwimmersQuerySchema)
  async findAllOfTeacher(
    @Query() query: ListSwimmersQueryDTO,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    if (user.role != Role.Admin) {
      console.log('não é admin', user);
      query.teacherAuthId = user.authId;
    }
    try {
      const result = await this.swimmerService.listByTeacherPaginated({
        page: +query.page,
        perPage: +query.perPage,
        onlyActive: query.onlyActive === 'true',
        search: query.search,
        teacherAuthId: query.teacherAuthId,
        branchId: user.branchId,
        periodId: query.periodId,
      });
      return {
        swimmers: SwimmerPresenter.toHTTPSwimmerAndPeriod(result.swimmers),
        numberOfPages: result.numberOfPages,
        swimmersWithoutReports: result.swimmersWithoutReports,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':swimmerId/teacher/:teacherId')
  @Roles(Role.Teacher)
  async updateTeacher(
    @Param('swimmerId') swimmerId: string,
    @Param('teacherId') teacherId: string,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    if (Number.isNaN(swimmerId)) throw new BadRequestException('Invalid id');

    const result = await this.swimmerService.updateSwimmerTeacher({
      swimmerNumber: +swimmerId,
      teacherNumber: +teacherId,
      branchId: user.branchId,
    });

    return 'ok';
  }

  @Put(':swimmerId/remove-teacher')
  @Roles(Role.Teacher)
  async removeSwimmer(
    @Param('swimmerId') swimmerId: string,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    if (Number.isNaN(swimmerId) || !swimmerId)
      throw new BadRequestException('Invalid id');

    const result = await this.swimmerService.RemoveSwimmerFromTeacher({
      swimmerNumber: +swimmerId,
      branchId: user.branchId,
    });

    return result;
  }

  @Get('/all')
  @Roles(Role.Teacher)
  @UseZodGuard('query', ListAllSwimmersQuerySchema)
  async findAllOfBranch(
    @Query() query: ListAllSwimmersQueryDTO,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    try {
      const result = await this.swimmerService.listAllPaginated({
        page: +query.page,
        perPage: +query.perPage,
        onlyActive: query.onlyActive === 'true',
        search: query.search,
        branchId: user.branchId,
      });
      return {
        swimmers: SwimmerPresenter.toHTTP(result.swimmers),
        numberOfPages: result.numberOfPages,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @Roles(Role.Teacher, Role.Admin, Role.Responsible)
  async findSwimmerInfo(
    @Param('id') id: string,
    @CurrentUser() user: AuthPayloadDTO,
  ): Promise<BadRequestException | SwimmerInfoResponse> {
    try {
      if (Number.isNaN(id)) throw new BadRequestException('Invalid id');
      console.log('id', id);
      const memberNumber = Number(id);
      let result: {
        swimmer: {
          name: string;
          actualLevel: string;
          photoUrl: string;
        };
        reports: {
          periodName: string;
          teacherName: string;
          level: string;
          id: string;
        }[];
      } = await this.swimmerService.findSwimmerInfo(
        memberNumber,
        user.branchId,
      );
      if (!result) {
        throw new BadRequestException('Swimmer not found');
      }
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
