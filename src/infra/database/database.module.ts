import { Module } from '@nestjs/common';
import { PrismaDatabaseModule } from './PrismaDatabase.module';

@Module({
  imports: [PrismaDatabaseModule],
  exports: [PrismaDatabaseModule],
})
export class DatabaseModule {}
