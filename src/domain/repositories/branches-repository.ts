import { Branch, Prisma } from '@prisma/client';

export abstract class BranchRepository {
  abstract createBranch(branch: Prisma.BranchCreateInput): Promise<Branch>;
  abstract findManyByEnterpriseId(enterpriseId: string): Promise<Branch[]>;
  abstract getBranchesByAuthId(teacherId: string): Promise<Branch[]>;
  abstract getBranchToken(branchId: string): Promise<string>;
  abstract getDefaultTeacher(branchId: string): Promise<number>;
  abstract findByUrl(url: string): Promise<Branch>;
}
