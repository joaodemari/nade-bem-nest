import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BranchController } from '../controllers/branch/branches.controller';
import { BranchService } from '../../../domain/services/branch.service';
import { ChangeBranchService } from '../../../domain/services/authentication/change-branch.service';
import { CryptographyModule } from '../criptography/cryptography.module';
import { ChangeBranchController } from '../controllers/authentication/changeBranch.controller';
import { EvoIntegrationService } from '../../../domain/services/integration/evoIntegration.service';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [BranchController, ChangeBranchController],
  providers: [BranchService, ChangeBranchService, EvoIntegrationService],
})
export class BranchModule {}
