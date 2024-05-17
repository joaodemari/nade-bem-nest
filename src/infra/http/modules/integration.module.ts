import { Module } from '@nestjs/common';
import { RefreshSwimmersController } from '../controllers/integration/refresh-swimmers.controller';
import { BullModule } from '@nestjs/bull';
import { REFRESH_QUEUE } from '../constants/queue.constants';
import { RefreshSwimmersConsumer } from 'src/infra/bull/refresh-swimmers.consumer';
import { EnvService } from 'src/infra/env/env.service';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: REFRESH_QUEUE,
    }),
  ],
  controllers: [RefreshSwimmersController],
  providers: [RefreshSwimmersConsumer, EnvService],
})
export class IntegrationModule {}
