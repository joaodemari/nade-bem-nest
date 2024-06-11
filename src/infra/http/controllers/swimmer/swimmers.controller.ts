import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SwimmerEntity } from '../../../../domain/entities/swimmer-entity';
import { SwimmersService } from '../../../../domain/services/swimmers.service';
import {
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

@Controller('swimmers')
export class SwimmersController {
  constructor(private readonly swimmerService: SwimmersService) {}

  @Get()
  @Roles(Role.teacher)
  @UseZodGuard('query', ListSwimmersQuerySchema)
  async findAll(
    @Query() query: ListSwimmersQueryDTO,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    const result = await this.swimmerService.listByTeacherPaginated({
      page: +query.page,
      perPage: +query.perPage,
      onlyActive: query.onlyActive === 'true',
      search: query.search,
      teacherNumber: user.memberNumber,
      branchId: user.branchId,
    });
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
    return {
      swimmers: SwimmerPresenter.toHTTP(result.value.swimmers),
      numberOfPages: result.value.numberOfPages,
      swimmersWithoutReports: result.value.swimmersWithoutReports,
      period: PeriodPresenter.toHTTP(result.value.period),
    };
  }

  @Get(':id')
  @IsPublic()
  async findSwimmerInfo(
    @Param('id') id: string,
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
          period: string;
          teacherName: string;
          level: string;
          id: string;
        }[];
      } = await this.swimmerService.findSwimmerInfo(memberNumber);
      if (!result) {
        throw new BadRequestException('Swimmer not found');
      }
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void | boolean | SwimmerEntity> {
    return this.swimmerService.delete(id);
  }
}
