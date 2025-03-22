import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SessionsController } from '../controllers/sessions/sessions.controller';
import { SessionsService } from '../../../domain/services/sessions/sessions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
