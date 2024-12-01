import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import toRawString from '../../../core/utils/toRawString';
import {
  authSchema,
  AuthResponseDto,
  AuthPayloadDTO,
} from '../../../infra/http/dtos/auth/login.dto';
import { Encrypter } from '../../criptography/encrypter';
import { AuthRepository } from '../../repositories/auth-repository';
import { BranchRepository } from '../../repositories/branches-repository';

type AuthenticateUserUseCaseRequest = z.infer<typeof authSchema>;

type AuthenticateUserUseCaseResponse = AuthResponseDto;

type ChangeTeacherBranch = {
  newBranchId: string;
} & AuthPayloadDTO;

@Injectable()
export class ChangeBranchService {
  constructor(
    private readonly branchRepository: BranchRepository,
    private encrypter: Encrypter,
  ) {}


  async getTeachersBranches(authId: string) {
    const branches = await this.branchRepository.getBranchesByAuthId(authId);

    return branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
    }));
  }

  async execute({
    memberNumber,
    role,
    email,
    branchId,
    newBranchId,
    name,
  }: ChangeTeacherBranch): Promise<AuthenticateUserUseCaseResponse> {
    const metadata = {
      memberNumber,
      role,
      email,
      branchId: newBranchId,
      name,
    };

    const token = await this.encrypter.encrypt(metadata);

    const response = {
      success: true,
      metadata: {
        token: token,
        name: metadata.name,
        email: metadata.email,
        memberNumber: metadata.memberNumber ?? null,
        role: metadata.role,
        branchId: metadata.branchId,
      },
    };

    return response;
  }
}
