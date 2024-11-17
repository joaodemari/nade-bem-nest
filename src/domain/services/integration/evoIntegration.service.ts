import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getEvoUrl } from '../../../infra/api/evourl';
import { AuthPayloadDTO } from '../../../infra/http/dtos/auth/login.dto';
import { BranchRepository } from '../../repositories/branches-repository';
import { Role } from '../../enums/role.enum';
import { SwimmersRepository } from '../../repositories/swimmers-repository';
import { SwimmerEvo } from '../../evo/entities/swimmer-evo-entity';

interface authEvoResponse {
  idMember: number;
  idBranch: number;
  idEnterprise: number;
  name: string;
  dns: string;
  successAuthenticate: boolean;
  urlResetPassword: string;
  urlMemberArea: string;
}

@Injectable()
export class EvoIntegrationService {
  constructor(
    private readonly branchRepository: BranchRepository,
    private readonly swimmersRepository: SwimmersRepository,
  ) {}

  async getSwimmersByEmail({
    email,
    branchId,
  }: {
    email: string;
    branchId: string;
  }): Promise<SwimmerEvo[]> {
    const evoToken = await this.branchRepository.getBranchToken(branchId);
    const evoApi = getEvoUrl(evoToken);
    const encodedEmail = encodeURIComponent(email);
    const { data } = await evoApi.get<SwimmerEvo[]>(
      '/members?email=' + encodedEmail,
    );
    return data.filter((swimmer) => {
      const swimmerBirthDate = new Date(swimmer.birthDate);
      const swimmerAge =
        new Date().getFullYear() - swimmerBirthDate.getFullYear();

      return swimmerAge <= 14;
    });
  }

  upsertManySwimmers({
    swimmers: swimmersToCreate,
    branchId,
  }: {
    swimmers: SwimmerEvo[];
    branchId: string;
  }): Promise<void> {
    return this.swimmersRepository.upsertManyFromEvo(
      swimmersToCreate,
      branchId,
    );
  }

  async authenticateResponsible(props: {
    email: string;
    password: string;
    branchId: string;
  }): Promise<AuthPayloadDTO> {
    const evoToken = await this.branchRepository.getBranchToken(props.branchId);
    const evoApi = getEvoUrl(evoToken);
    const encodedEmail = encodeURIComponent(props.email);
    const encodedPassword = encodeURIComponent(props.password);

    const { data } = await evoApi
      .post<authEvoResponse>(
        '/members/auth?email=' + encodedEmail + '&password=' + encodedPassword,
      )
      .catch((err) => {
        console.log(err);
        throw new Error('Evo credentials invalid');
      });

    if (!data) {
      throw new Error('Invalid credentials');
    }
    console.log(data);
    const user: AuthPayloadDTO = {
      name: data.name,
      memberNumber: data.idMember,
      branchId: props.branchId,
      role: Role.Responsible,
      email: props.email,
      authId: null,
    };
    return user;
  }

  async transferSwimmerToTeacher(props: {
    IdCliente: number;
    IdProfessorDestino: number;
    IdBranchToken: string;
    IdConsultorDestino: number;
    IdFilialDestino: number;
  }): Promise<boolean> {
    const evoApi = getEvoUrl(props.IdBranchToken);
    try {
      console.log('props', props);
      console.log('btoa', btoa(props.IdBranchToken));
      const response = await evoApi.post(
        'members/transfer',
        {
          idCliente: props.IdCliente,
          idFilialDestino: props.IdFilialDestino,
          idBranchToken: props.IdBranchToken,
          idConsultorDestino: props.IdConsultorDestino,
          idProfessorDestino: props.IdProfessorDestino,
        },
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        },
      );

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findSwimmer(swimmerId: number, evoToken: string): Promise<SwimmerEvo> {
    const evoApi = getEvoUrl(evoToken);
    console.log(swimmerId);
    try {
      const swimmerInfo = await evoApi
        .get<SwimmerEvo[]>('members?idsMembers=' + swimmerId)
        .then((response) => {
          return response.data[0];
        });
      return swimmerInfo;
    } catch (err) {
      console.log(err);
    }
  }
}
