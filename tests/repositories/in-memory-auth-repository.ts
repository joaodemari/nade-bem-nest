import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AuthRepository } from '../../src/domain/repositories/auth-repository';
import { TeachersRepository } from '../../src/domain/repositories/teachers-repository';
import { AdminsRepository } from '../../src/domain/repositories/admins-repository';
import { BranchRepository } from '../../src/domain/repositories/branches-repository';
import { BranchTeacherRepository } from '../../src/domain/repositories/branch-teacher-repository';
import { EnterpriseRepository } from '../../src/domain/repositories/enterprise-repository';
import { authsDummyDB } from './dummyDB';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  constructor(
    private readonly teachersRepository: TeachersRepository,
    private readonly adminsRepository: AdminsRepository,
    private readonly branchTracherRepository: BranchTeacherRepository,
    private readonly enterprisesRepository: EnterpriseRepository,
    private readonly branchRepository: BranchRepository,
  ) {}

  auths: Auth[] = authsDummyDB;

  async findByEmail(email: string): Promise<{ auth: Auth; branchId: string }> {
    console.log('finding by email');
    const auth = this.auths.find((a) => a.email === email);

    if (!auth) return;

    const teacher = await this.teachersRepository.findByAuthId(auth.id);

    let branchId: string;

    if (teacher) {
      const branches = await this.branchTracherRepository.findManyByTeacherId(
        teacher.id,
      );

      if (branches.length === 0) throw new Error('user has no Branches');
      branchId = branches[0].id;
    } else {
      const admin = await this.adminsRepository.findByAuthId(auth.id);
      if (!admin) throw new Error('Admin not found');
      const enterprise = await this.enterprisesRepository.findById(
        admin.enterpriseId,
      );
      if (!enterprise) throw new Error('This admin has no enterprises');
      const branches = await this.branchRepository.findManyByEnterpriseId(
        enterprise.id,
      );

      if (branches.length === 0)
        throw new Error('The enterprise of the admin has no branches');

      branchId = branches[0].id;
    }

    return {
      auth,
      branchId,
    };
  }
}
