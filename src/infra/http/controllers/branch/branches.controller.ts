import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from '../../../../domain/services/branch.service';
import { IsPublic } from '../../decorators/is-public.decorator';
import { CreateBranchDto } from '../../dtos/branch/createBranch.dto';
import { UseZodGuard, ZodGuard } from 'nestjs-zod';
import { ChangeBranchService } from '../../../../domain/services/authentication/change-branch.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthPayloadDTO } from '../../dtos/auth/login.dto';
import { z } from 'zod';
import { EvoIntegrationService } from '../../../../domain/services/integration/evoIntegration.service';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly service: BranchService,
    private readonly changeBranchService: ChangeBranchService,
    private readonly evoService: EvoIntegrationService,
  ) {}

  @Post()
  @UseZodGuard('body', CreateBranchDto)
  async create(@Body() body: CreateBranchDto) {
    return await this.service.createBranch(body);
  }

  @IsPublic()
  @Get('logo/:branchId')
  async getBranchLogo(@Param('branchId') branchId: string) {
    try {
      return await this.evoService.getBranchLogo(branchId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @IsPublic()
  @Get('find-by-url/:url')
  @UseGuards(new ZodGuard('params', z.object({ url: z.string() })))
  async findByUrl(@Param('url') url: string) {
    try {
      return await this.service.lookUpByBranchUrl(url);
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  @Get('by-user')
  async getBranchesByTeacherId(@CurrentUser() user: AuthPayloadDTO) {
    return await this.changeBranchService.getTeachersBranches(user.authId);
  }
}
