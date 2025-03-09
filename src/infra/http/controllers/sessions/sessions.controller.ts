import { Controller, Get, Query } from '@nestjs/common';
import { createZodDto, UseZodGuard } from 'nestjs-zod';
import { z } from 'zod';
import { SessionsService } from '../../../../domain/services/sessions/sessions.service';
import { Role } from '../../../../domain/enums/role.enum';
import { Roles } from '../../decorators/role.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';

export const getResponsibleVisitsByRangeQuerySchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});

export class GetResponsibleVisitsByRangeQuery extends createZodDto(
  getResponsibleVisitsByRangeQuerySchema,
) {}

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Roles(Role.Admin)
  @Get('responsibles')
  @UseZodGuard('query', getResponsibleVisitsByRangeQuerySchema)
  async getResponsibleVisitsByRange(
    @Query() query: GetResponsibleVisitsByRangeQuery,
    @CurrentUser() { branchId }: AuthPayloadDTO,
  ) {
    return await this.sessionsService.getVisitsByRange({
      start: query.start,
      end: query.end,
      role: Role.Responsible,
      branchId,
    });
  }
}
