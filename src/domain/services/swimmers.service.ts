import { SwimmersRepository } from '../repositories/swimmers-repository';
import { Injectable } from '@nestjs/common';
import {
  ListAllSwimmersProps,
  ListAllSwimmersResponseRight,
  ListSwimmersProps,
  ListSwimmersResponseRight,
} from '../../infra/http/dtos/ListSwimmers.dto';
import PeriodsRepository from '../repositories/periods-repository';
import cleanContains from '../../core/utils/cleanContains';
import { SwimmerInfoResponse } from '../../infra/http/dtos/swimmers/swimmerInfo.dto';
import { Report, Swimmer, Teacher } from '@prisma/client';
import { UpdateSwimmerTeacherProps } from '../../infra/http/dtos/swimmers/updateSwimmer/updateSwimmerTeacher.dto';
import { BranchRepository } from '../repositories/branches-repository';
import { EvoIntegrationService } from './integration/evoIntegration.service';
import { SwimmerAndTeacher } from '../repositories/selections-repository';
import { SwimmerEvo } from '../evo/entities/swimmer-evo-entity';

export type swimmerAndReport = Swimmer & {
  isFromThisPeriod?: boolean;
  lastReportPeriodId?: string;
} & {
  Report: Report[];
};
@Injectable()
export class SwimmersService {
  constructor(
    private readonly repository: SwimmersRepository,
    private readonly periodsRepository: PeriodsRepository,
    private readonly branchRepository: BranchRepository,
    private readonly evoIntegrationService: EvoIntegrationService,
  ) {}

  async findSwimmerInfoById(
    swimmerId: string,
  ): Promise<SwimmerInfoResponse | null> {
    let result = await this.repository.findSwimmerAndReportsById(swimmerId);

    return result;
  }

  async findSwimmerInfo(
    memberNumber: number,
    branchId: string,
    teacherAuthId: string,
  ): Promise<SwimmerInfoResponse | null> {
    let result = await this.repository.findSwimmerAndReports(memberNumber);

    console.log(result);
    if (!result) {
      const swimmerInEvo = await this.evoIntegrationService.findSwimmer({
        memberId: memberNumber,
        branchId,
      });

      await this.repository.createSwimmerFromEvo(
        swimmerInEvo,
        branchId,
        teacherAuthId,
      );

      result = await this.repository.findSwimmerAndReports(memberNumber);
    }

    return result;
  }

  async RemoveSwimmerFromTeacher(props: {
    swimmerNumber: number;
    branchId: string;
  }) {
    const defaultTeacherNumber = await this.branchRepository.getDefaultTeacher(
      props.branchId,
    );

    await this.updateSwimmerTeacher({
      swimmerNumber: props.swimmerNumber,
      teacherNumber: defaultTeacherNumber,
      branchId: props.branchId,
    });
  }

  async updateSwimmerTeacher(props: UpdateSwimmerTeacherProps) {
    const { swimmerNumber, teacherNumber, branchId } = props;
    const branchToken = await this.branchRepository.getBranchToken(branchId);

    const swimmerInformation = await this.evoIntegrationService.findSwimmer({
      memberId: swimmerNumber,
      branchId,
    });

    const swimmerTransfer =
      await this.evoIntegrationService.transferSwimmerToTeacher({
        IdCliente: swimmerNumber,
        IdProfessorDestino: teacherNumber,
        IdBranchToken: branchToken,
        IdConsultorDestino: swimmerInformation.idEmployeeConsultant,
        IdFilialDestino: swimmerInformation.idBranch,
      });

    if (!swimmerTransfer) {
      throw new Error('Erro ao transferir aluno');
    }

    // TODO: add teacherId here
    await this.repository.updateSwimmerTeacher(
      swimmerNumber,
      'TODO: ADD teacherId Here',
    );

    return true;
  }

  async querySwimmers({
    periodId,
    branchId,
    search,
    teacherAuthId,
  }: QuerySwimmersParamsDTO): Promise<{
    nadeBem: SwimmerAndTeacherAndIsFromSelection[];
    evo: SwimmerEvo[];
  }> {
    const swimmersInNadeBem = await this.repository.querySwimmers({
      branchId,
      search,
    });

    if (swimmersInNadeBem.length === 0) {
      const swimmerSearchResult =
        await this.evoIntegrationService.searchSwimmers({
          search,
          branchId,
          take: 10,
        });
      return { nadeBem: [], evo: swimmerSearchResult };
    }

    const result = swimmersInNadeBem.map((s) => {
      return {
        ...s,
        Teacher: s.Teacher,
        isFromSelection: s.periodTeacherSelections.some(
          (selection) =>
            selection.periodId === periodId &&
            selection.teacherPeriodGroupSelection.teacherAuthId ===
              teacherAuthId,
        ),
      };
    });
    return { nadeBem: result, evo: [] };
  }

  async toSwimmerAndTeacherAndIsFromSelection(
    swimmersInEvo: SwimmerEvo[],
  ): Promise<SwimmerAndTeacherAndIsFromSelection[]> {
    return swimmersInEvo.map((s) => {
      return {
        name: s.firstName + ' ' + s.lastName,
        photoUrl: s.photoUrl,

        memberNumber: s.idMember,
        isFromSelection: false,
      };
    });
  }

  async listAllPaginated({
    page,
    perPage,
    search,
    onlyActive,
    branchId,
  }: ListAllSwimmersProps): Promise<ListAllSwimmersResponseRight> {
    if (page < 1) page = 1;

    // TODO: Melhorar a performance disso aqui:
    // fazer apenas 1 requisição para a parte de swimmers
    // e não 3 kkkkkkkkkk

    const swimmers: { swimmers: Swimmer[]; totalSwimmers: number } =
      await this.repository.findManyPaginated({
        branchId,
        onlyActive,
        search,
        page,
        perPage,
      });

    // if (onlyActive) swimmers = swimmers.filter((s) => s.isActive);

    // const searchFilter = (s: swimmerAndPeriod) =>
    //   s.memberNumber.toString().includes(search) ||
    //   cleanContains({ containsThis: search, thisOne: s.name });

    // const swimmersFiltered = swimmers.filter((s) => searchFilter(s));
    return {
      swimmers: swimmers.swimmers,
      numberOfPages: Math.ceil(swimmers.totalSwimmers / perPage),
    };
  }

  async listByTeacherPaginated({
    page,
    perPage,
    search,
    teacherAuthId,
    onlyActive,
    branchId,
    periodId,
  }: ListSwimmersProps): Promise<ListSwimmersResponseRight> {
    if (page < 1) page = 1;

    // TODO: Melhorar a performance disso aqui:
    // fazer apenas 1 requisição para a parte de swimmers
    // e não 3 kkkkkkkkkk

    const {
      swimmers,
      totalSwimmers,
    }: {
      swimmers: swimmerAndReport[];
      totalSwimmers: number;
    } = await this.repository.findManyPaginated({
      branchId,
      onlyActive,
      search,
      page,
      perPage,
      teacherAuthId,
    });

    console.log('swimmerscount', swimmers.length);

    swimmers.forEach((s) => {
      s.isFromThisPeriod =
        s.lastReportPeriodId && s.lastReportPeriodId === periodId;
      return s;
    });

    return {
      swimmers,
      numberOfPages: Math.ceil(totalSwimmers / perPage),
      swimmersWithoutReports: 0,
    };
  }
}

export type QuerySwimmersParamsDTO = {
  search: string;
  branchId: string;
  periodId: string;
  teacherAuthId: string;
};

export type SwimmerAndTeacherAndIsFromSelection = {
  id?: string;
  name: string;
  photoUrl: string;
  memberNumber: number;
  teacher?: Teacher;
  isFromSelection: boolean;
};
