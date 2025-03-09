import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../../../decorators/role.decorator';
import { Role } from '../../../../../domain/enums/role.enum';
import {
  ListSwimmersQueryDTO,
  ListSwimmersQuerySchema,
} from '../../../dtos/ListSwimmers.dto';
import { UseZodGuard } from 'nestjs-zod';
import { SwimmerPresenter } from '../../../../presenters/swimmers-presenter';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../../dtos/auth/login.dto';
import { SelectionSwimmersByTeacherQueryDTO } from '../../../dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import { SelectionService } from '../../../../../domain/services/selection/selection.service';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination';
import { Swimmer } from '@prisma/client';
import { z } from 'zod';
import { SwimmerAndTeacher } from '../../../../../domain/repositories/selections-repository';

@Controller('selection')
export class SelectionSwimmersController {
  constructor(private readonly selectionService: SelectionService) {}
  @Get('swimmers')
  @Roles(Role.Teacher)
  @UseZodGuard('query', ListSwimmersQuerySchema)
  async findAllOfTeacher(
    @Query() query: SelectionSwimmersByTeacherQueryDTO,
    @CurrentUser() user: AuthPayloadDTO,
  ): Promise<{
    data: SwimmerAndTeacher[];
    meta: PageNumberPaginationMeta<true>;
  }> {
    try {
      return await this.selectionService.findSwimmersByTeacherAndPeriodPaginated(
        {
          page: +query.page,
          perPage: +query.perPage,
          search: query.search,
          teacherAuthId: user.authId,
          periodId: query.periodId,
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset')
  @Roles(Role.Teacher)
  @UseZodGuard('query', z.object({ periodId: z.string() }))
  async resetSwimmersToPeriod(
    @CurrentUser() user: AuthPayloadDTO,
    @Query() query: { periodId: string },
  ): Promise<void> {
    try {
      return await this.selectionService.resetSwimmersFromSelection({
        teacherAuthId: user.authId,
        periodId: query.periodId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
