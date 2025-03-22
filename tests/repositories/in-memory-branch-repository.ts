import { Injectable } from '@nestjs/common';
import { Branch, Prisma } from '@prisma/client';
import { BranchRepository } from '../../src/domain/repositories/branches-repository';
import { branchesDummyDB } from './dummyDB';

@Injectable()
export class InMemoryBranchRepository implements BranchRepository {
  constructor() {}

  branches: Branch[] = branchesDummyDB;
  createBranch(branch: Prisma.BranchCreateInput): Promise<Branch> {
    throw new Error('Method not implemented.');
  }
  async findManyByEnterpriseId(enterpriseId: string): Promise<Branch[]> {
    return this.branches.filter(
      (branch) => branch.enterpriseId == enterpriseId,
    );
  }
  getBranchesByAuthId(teacherId: string): Promise<Branch[]> {
    throw new Error('Method not implemented.');
  }
  getBranchToken(branchId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getDefaultTeacher(branchId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  findByUrl(url: string): Promise<Branch> {
    throw new Error('Method not implemented.');
  }
}
