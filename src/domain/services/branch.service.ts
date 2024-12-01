import { Injectable } from '@nestjs/common';
import { BranchRepository } from '../repositories/branches-repository';
import { CreateBranchDto } from '../../infra/http/dtos/branch/createBranch.dto';
import { SafeBranchDTO } from '../../infra/http/dtos/branch/safeBranch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {}

  async createBranch(createBranchDTO: CreateBranchDto) {
    return await this.repository.createBranch({
      apiKey: createBranchDTO.apiKey,
      name: createBranchDTO.name,
      enterprise: { connect: { id: 'gotch you' } },
      url: createBranchDTO.url,
      logoUrl: createBranchDTO.logoUrl,
    });
  }

  async lookUpByBranchUrl(branchUrl: string): Promise<SafeBranchDTO> {
    const branch = await this.repository.findByUrl(branchUrl);
    return {
      id: branch.id,
      name: branch.name,
      url: branch.url,
      logoUrl: branch.logoUrl,
    };
  }
}
