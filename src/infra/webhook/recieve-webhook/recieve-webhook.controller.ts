import { Body, Controller, Post } from '@nestjs/common';
import { EvoWebhook } from '../../integration/dtos/EvoWebhook.dto';
import { IsPublic } from '../../http/decorators/is-public.decorator';

@IsPublic()
@Controller('evo-webhook/alter-member')
export class RecieveWebhookController {
  @Post()
  handle(@Body() body: EvoWebhook) {
    console.log(body);
  }
}
