import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
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

interface ResetPasswordResponse {
  result: string;
}

@Injectable()
export class EvoIntegrationService {
  constructor(
    private readonly branchRepository: BranchRepository,
    private readonly swimmersRepository: SwimmersRepository,
  ) {}

  async getResetPasswordLink({
    branchId,
    email,
  }: {
    branchId: string;
    email: string;
  }): Promise<{ redirectLink: string }> {
    const branchToken = await this.branchRepository.getBranchToken(branchId);
    const evoApi = this.getEvoUrl({ token: branchToken });

    try {
      const { data } = await evoApi.get<ResetPasswordResponse>(
        `members/resetPassword?user=${email}`,
      );

      return { redirectLink: data.result };
    } catch (error) {
      throw new Error('Usuário não encontrado');
    }
  }

  private getEvoUrl = ({ token }: { token: string }): AxiosInstance => {
    const encryptedCredentials = btoa(token);
    return axios.create({
      baseURL: 'https://evo-integracao.w12app.com.br/api/v1',
      headers: {
        Authorization: `Basic ${encryptedCredentials}`,
      },
    });
  };

  async getSwimmersByEmail({
    email,
    branchId,
  }: {
    email: string;
    branchId: string;
  }): Promise<SwimmerEvo[]> {
    const evoToken = await this.branchRepository.getBranchToken(branchId);
    const evoApi = this.getEvoUrl({ token: evoToken });
    const encodedEmail = encodeURIComponent(email);
    const { data } = await evoApi.get<SwimmerEvo[]>(
      '/members?email=' + encodedEmail,
    );

    const swimmers: SwimmerEvo[] = data.filter((swimmer) => {
      const swimmerBirthDate = new Date(swimmer.birthDate);
      const swimmerAge =
        new Date().getFullYear() - swimmerBirthDate.getFullYear();

      return swimmerAge <= 14;
    });

    return swimmers;
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
    const evoApi = this.getEvoUrl({ token: evoToken });
    const encodedEmail = encodeURIComponent(props.email);
    const encodedPassword = encodeURIComponent(props.password);

    const { data } = await evoApi.post<authEvoResponse>(
      '/members/auth?email=' + encodedEmail + '&password=' + encodedPassword,
    );
    if (data && data.successAuthenticate !== true) {
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

  async fakeAuthenticateResponsible(props: {
    email: string;
    password: string;
    branchId: string;
  }): Promise<AuthPayloadDTO> {
    console.error('Fake authenticate responsible');
    const evoToken = await this.branchRepository.getBranchToken(props.branchId);
    const evoApi = this.getEvoUrl({ token: evoToken });
    const encodedEmail = encodeURIComponent(props.email);

    const { data } = await evoApi.get<SwimmerEvo[]>(
      '/members?email=' + encodedEmail,
    );

    if (data && data.length === 0) {
      throw new Error('Invalid credentials');
    }

    const firstSwimmer = data[0];
    const user: AuthPayloadDTO = {
      name: firstSwimmer.firstName,
      memberNumber: firstSwimmer.idMember,
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
    const evoApi = this.getEvoUrl({ token: props.IdBranchToken });
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
    const evoApi = this.getEvoUrl({ token: evoToken });
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
