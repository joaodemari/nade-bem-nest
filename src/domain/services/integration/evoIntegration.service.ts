import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getEvoUrl } from '../../../infra/api/evourl';
interface EvoMemberResponse {
  idBranch: number;
  idEmployeeConsultant: number;
}

@Injectable()
export class EvoIntegrationService {
  constructor() {}

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

  async getSwimmerInformationToTransfer(
    swimmerId: number,
    evoToken: string,
  ): Promise<{
    idFilial: number;
    idConsultor: number;
  }> {
    const evoApi = getEvoUrl(evoToken);
    console.log(swimmerId);
    try {
      const swimmerInfo = await evoApi
        .get<EvoMemberResponse[]>('members?idsMembers=' + swimmerId)
        .then((response) => {
          return response.data[0];
        });
      return {
        idFilial: swimmerInfo.idBranch,
        idConsultor: swimmerInfo.idEmployeeConsultant,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
