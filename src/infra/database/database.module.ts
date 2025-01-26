import { Module } from '@nestjs/common';
import { PrismaDatabaseModule } from './PrismaDatabase.module';
import { InMemoryDatabaseModule } from './InMemoryDatabase.module';

@Module({
  imports: [InMemoryDatabaseModule],
  exports: [InMemoryDatabaseModule],
})
export class DatabaseModule {}
