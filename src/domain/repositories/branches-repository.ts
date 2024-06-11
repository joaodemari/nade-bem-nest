import { IRepository } from '../../core/generic/I-repository';
import { BranchEntity } from '../entities/branch-entity';
import { TeacherEntity } from '../entities/TeacherEntity';

export abstract class BranchRepository extends IRepository<BranchEntity> {
  abstract createBranch(branch: BranchEntity): Promise<BranchEntity>;
  abstract updateBranchSwimmers(branchId: string): Promise<void>;
}
