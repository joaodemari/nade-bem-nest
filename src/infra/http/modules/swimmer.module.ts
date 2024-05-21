import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infra/database/database.module';
import { SwimmersController } from '../controllers/swimmer/swimmers.controller';
import { SwimmersService } from '../../../domain/services/swimmers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SwimmersController],
  providers: [SwimmersService],
})
export class SwimmerModule {}
