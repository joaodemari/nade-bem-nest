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
      search: query.search,
      teacherNumber: user.memberNumber,
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
  findOne(@Param('id') id: string): Promise<SwimmerEntity | void> {
    return this.swimmerService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void | boolean | SwimmerEntity> {
    return this.swimmerService.delete(id);
  }
}
