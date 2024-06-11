import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../core/generic/base-service';
import { BranchEntity } from '../../../../domain/entities/branch-entity';
import { BranchRepository } from '../../../../domain/repositories/branches-repository';
import { CreateBranchDto } from '../../dtos/branch/createBranch.dto';

@Injectable()
export class BranchService extends BaseService<BranchEntity, BranchRepository> {
  constructor(repository: BranchRepository) {
    super(repository);
  }

  async createBranch(createBranchDTO: CreateBranchDto) {
    const branch = BranchEntity.create({
      name: createBranchDTO.name,
      apiKey: createBranchDTO.apiKey,
    });
    return await this.repository.createBranch(branch);
  }
}
