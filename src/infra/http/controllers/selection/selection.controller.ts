import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { SelectionService } from '../../../../domain/services/selection/selection.service';
import { Swimmer, TeacherPeriodGroupSelection } from '@prisma/client';
import { SwimmerAndTeacher } from '../../../../domain/repositories/selections-repository';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';

@Controller('selections')
export class SelectionController {
  constructor(private readonly selectionService: SelectionService) {}

  @Roles(Role.Teacher)
  @Post(':groupSelectionId/swimmer/:swimmerId')
  async addSwimmerToSelection(
    @Param('groupSelectionId') groupSelectionId: string,
    @Param('swimmerId') swimmerId: string,
  ) {
    try {
      await this.selectionService.addSwimmerToSelection({
        swimmerId,
        groupSelectionId,
      });
    } catch (error) {
      return new HttpException(error.message, 400);
    }
  }

  @Roles(Role.Teacher)
  @Post(':groupSelectionId/swimmer/:memberId/evo')
  async addSwimmerEvoToSelection(
    @Param('groupSelectionId') groupSelectionId: string,
    @Param('memberId') memberId: number,
    @CurrentUser() user: AuthPayloadDTO,
  ) {
    try {
      await this.selectionService.addEvoSwimmerToSelection({
        memberId,
        groupSelectionId,
        branchId: user.branchId,
        teacherAuthId: user.authId,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 400);
    }
  }

  @Roles(Role.Teacher)
  @Delete(':groupSelectionId/swimmer/:swimmerId')
  async removeSelection(
    @Param('groupSelectionId') groupSelectionId: string,
    @Param('swimmerId') swimmerId: string,
  ) {
    try {
      await this.selectionService.removeSwimmerFromSelection({
        groupSelectionId,
        swimmerId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Roles(Role.Teacher)
  @Get('period/:periodId/teacher/:teacherAuthId')
  async getSelectionsFromPeriodAndTeacher(
    @Param('periodId') periodId: string,
    @Param('teacherAuthId') teacherAuthId: string,
  ): Promise<FindSelectionGroupWithSwimmersResponseDTO> {
    try {
      return await this.selectionService.getSelectionWithSwimmersFromPeriodAndTeacher(
        {
          periodId,
          teacherAuthId,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export type FindSelectionGroupWithSwimmersResponseDTO = {
  groupSelection: TeacherPeriodGroupSelection;
};
