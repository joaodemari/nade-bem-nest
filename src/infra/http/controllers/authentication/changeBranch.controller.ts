import { BadRequestException, Controller, Param, Post } from '@nestjs/common';
import { AuthPayloadDTO, AuthResponseDto } from '../../dtos/auth/login.dto';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../../../domain/enums/role.enum';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ChangeBranchService } from '../../../../domain/services/authentication/change-branch.service';

@Controller('change-branch')
export class ChangeBranchController {
  constructor(private readonly changeBranchService: ChangeBranchService) {}

  @Roles(Role.Teacher)
  @Post(':newBranchId')
  async login(
    @CurrentUser() user: AuthPayloadDTO,
    @Param('newBranchId') newBranchId: string,
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.changeBranchService.execute({
        ...user,
        newBranchId,
      });

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
