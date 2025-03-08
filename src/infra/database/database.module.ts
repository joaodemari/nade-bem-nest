import { Module } from '@nestjs/common';
import { InMemoryDatabaseModule } from './InMemoryDatabase.module';
import { PrismaDatabaseModule } from './PrismaDatabase.module';

@Module({
  imports: [PrismaDatabaseModule],
  exports: [PrismaDatabaseModule],
})
export class DatabaseModule {}
