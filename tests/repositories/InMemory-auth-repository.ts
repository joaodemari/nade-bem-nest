import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AuthRepository } from '../../src/domain/repositories/auth-repository';
import { TeachersRepository } from '../../src/domain/repositories/teachers-repository';
import { AdminsRepository } from '../../src/domain/repositories/admins-repository';
import { BranchTeacherRepository } from './inMemory-branch-Teachers-repository';
import { EnterpriseRepository } from './inMemory-enterprises-repository';
import { BranchRepository } from '../../src/domain/repositories/branches-repository';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  constructor(
    private readonly teachersRepository: TeachersRepository,
    private readonly adminsRepository: AdminsRepository,
    private readonly branchTracherRepository: BranchTeacherRepository,
    private readonly enterprisesRepository: EnterpriseRepository,
    private readonly branchRepository: BranchRepository,
  ) {}

  auths: Auth[] = [
    {
      email: 'joaodemari1@gmail.com',
      id: 'joaodemari1',
      name: 'João Professor',
      password: '123456',
      resetToken: null,
      role: 'admin',
    },
  ];

  async findByEmail(
    email: string,
  ): Promise<{ auth: Auth; memberNumber: number | null; branchId: string }> {
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
      const enterprise = await this.enterprisesRepository.findByAdminId(
        admin.id,
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
      memberNumber: teacher?.teacherNumber ?? null,
      branchId,
    };
  }
}
