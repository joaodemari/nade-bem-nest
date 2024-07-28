import { Body, Controller, Get, Post } from '@nestjs/common';
import { BranchService } from '../../../../domain/services/branch.service';
import { IsPublic } from '../../decorators/is-public.decorator';
import { CreateBranchDto } from '../../dtos/branch/createBranch.dto';
import { UseZodGuard } from 'nestjs-zod';
import { ChangeBranchService } from '../../../../domain/services/authentication/change-branch.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly service: BranchService,
    private readonly changeBranchService: ChangeBranchService,
  ) {}

  @Post()
  @UseZodGuard('body', CreateBranchDto)
  async create(@Body() body: CreateBranchDto) {
    return await this.service.createBranch(body);
  }

  @Get('by-user')
  async getBranchesByTeacherId(@CurrentUser() user: AuthPayloadDTO) {
    return await this.changeBranchService.getTeachersBranches(user.authId);
  }
}
