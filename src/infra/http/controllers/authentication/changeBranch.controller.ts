import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ActionNotAllowed } from '../../../../core/errors/action-not-allowed-error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthenticationService } from '../../../../domain/services/authentication.service';
import {
  AuthDTO,
  AuthPayloadDTO,
  AuthResponseDto,
} from '../../dtos/auth/login.dto';
import { IsPublic } from '../../decorators/is-public.decorator';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ChangeBranchService } from '../../../../domain/services/authentication/change-branch.service';

@Controller('change-branch')
export class ChangeBranchController {
  constructor(private readonly changeBranchService: ChangeBranchService) {}

  @Roles(Role.teacher)
  @Post(':newBranchId')
  async login(
    @CurrentUser() user: AuthPayloadDTO,
    @Param('newBranchId') newBranchId: string,
  ): Promise<AuthResponseDto> {
    console.log('newBranchId', newBranchId);

    const result = await this.changeBranchService.execute({
      ...user,
      newBranchId,
    });
    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ActionNotAllowed:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
