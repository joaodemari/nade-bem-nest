import { Controller, Get } from '@nestjs/common';

@Controller()
export class CheckController {
  @Get()
  handle() {
    return 'I am batman...';
  }
}
