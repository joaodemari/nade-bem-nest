import { Branch, Prisma } from '@prisma/client';
import { IRepository } from '../../core/generic/I-repository';
import { BranchEntity } from '../entities/branch-entity';

export abstract class BranchRepository {
  abstract createBranch(branch: Prisma.BranchCreateInput): Promise<Branch>;
  abstract getBranchesByAuthId(teacherId: string): Promise<Branch[]>;
}
