import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BranchController } from '../controllers/teacher/branches.controller';
import { BranchService } from '../controllers/branch/branch.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
