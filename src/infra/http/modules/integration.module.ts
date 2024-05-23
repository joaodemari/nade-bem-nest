import { Module } from '@nestjs/common';
import { RefreshSwimmersController } from '../controllers/integration/refresh-swimmers.controller';
import { BullModule } from '@nestjs/bull';
import { REFRESH_QUEUE } from '../constants/queue.constants';
import { RefreshSwimmersConsumer } from '../../../infra/bull/refresh-swimmers.consumer';
import { EnvService } from '../../../infra/env/env.service';
import { DatabaseModule } from '../../../infra/database/database.module';
import { RecieveWebhookController } from '../../webhook/recieve-webhook/recieve-webhook.controller';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: REFRESH_QUEUE,
    }),
  ],
  controllers: [RefreshSwimmersController, RecieveWebhookController],
  providers: [RefreshSwimmersConsumer, EnvService],
})
export class IntegrationModule {}
