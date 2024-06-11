import { Body, Controller, Get, Post } from '@nestjs/common';
import { BranchService } from '../branch/branch.service';
import { IsPublic } from '../../decorators/is-public.decorator';
import { CreateBranchDto } from '../../dtos/branch/createBranch.dto';
import { UseZodGuard } from 'nestjs-zod';

@IsPublic()
@Controller('branches')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @Post()
  @UseZodGuard('body', CreateBranchDto)
  async create(@Body() body: CreateBranchDto) {
    return await this.service.createBranch(body);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }
}
