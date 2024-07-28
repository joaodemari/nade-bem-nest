import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/generic/base-service';
import { BranchEntity } from '../entities/branch-entity';
import { BranchRepository } from '../repositories/branches-repository';
import { CreateBranchDto } from '../../infra/http/dtos/branch/createBranch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {}

  async createBranch(createBranchDTO: CreateBranchDto) {
    return await this.repository.createBranch({
      apiKey: createBranchDTO.apiKey,
      name: createBranchDTO.name,
      enterprise: { connect: { id: 'gotch you' } },
    });
  }
}
