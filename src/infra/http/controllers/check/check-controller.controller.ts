import { Controller, Get } from '@nestjs/common';
import { SelectionsRepository } from '../../../../domain/repositories/selections-repository';
import { IsPublic } from '../../decorators/is-public.decorator';
@IsPublic()
@Controller()
export class CheckController {
  constructor(private selectionRepository: SelectionsRepository) {}

  @Get()
  handle() {
    return 'I am batman...';
  }

  @Get('data-fix')
  async handleDataFix() {
    return await this.selectionRepository.createUnexistantSelections();
  }
}
