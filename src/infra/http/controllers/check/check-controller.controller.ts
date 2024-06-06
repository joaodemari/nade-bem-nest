import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '../../decorators/is-public.decorator';
@IsPublic()
@Controller()
export class CheckController {
  @Get()
  handle() {
    return 'I am batman...';
  }
}
