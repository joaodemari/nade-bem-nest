import { Injectable } from '@nestjs/common';
import {
  SelectionsRepository,
  SwimmerAndTeacher,
} from '../../repositories/selections-repository';
import { Swimmer, TeacherPeriodGroupSelection } from '@prisma/client';
import { FindSelectionGroupWithSwimmersResponseDTO } from '../../../infra/http/controllers/selection/selection.controller';
import {
  SelectionSwimmersByTeacherQueryDTO,
  SelectionSwimmersQueryDTO,
} from '../../../infra/http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination';
import { EvoIntegrationService } from '../integration/evoIntegration.service';
import { SwimmersRepository } from '../../repositories/swimmers-repository';

@Injectable()
export class SelectionService {
  constructor(
    private readonly selectionsRepository: SelectionsRepository,
    private readonly integrationService: EvoIntegrationService,
    private readonly swimmersRepository: SwimmersRepository,
  ) {}

  async resetSwimmersFromSelection(
    props: ResetSwimmersFromGroupSelectionProps,
  ) {
    await this.selectionsRepository.resetSwimmersFromSelection(props);
  }

  async findSwimmersByTeacherAndPeriodPaginated(
    props: SelectionSwimmersQueryDTO,
  ): Promise<{
    data: SwimmerAndTeacher[];
    meta: PageNumberPaginationMeta<true>;
  }> {
    const [swimmers, meta] =
      await this.selectionsRepository.findSwimmersByBranchAndPeriodPaginated(
        props,
      );

    return {
      data: swimmers,
      meta,
    };
  }

  async addEvoSwimmerToSelection(props: {
    memberId: number;
    groupSelectionId: string;
    branchId: string;
    teacherAuthId: string;
  }) {
    const swimmerInEvo = await this.integrationService.findSwimmer({
      memberId: props.memberId,
      branchId: props.branchId,
    });

    const swimmer = await this.swimmersRepository.createSwimmerFromEvo(
      swimmerInEvo,
      props.branchId,
      props.teacherAuthId,
    );

    console.log(swimmer);

    await this.addSwimmerToSelection({
      swimmerId: swimmer.id,
      groupSelectionId: props.groupSelectionId,
    });
  }

  async addSwimmerToSelection(props: UpdateSwimmerFromSelectionProps) {
    const selection =
      await this.selectionsRepository.findSelectionBySwimmerAndGroupSelection({
        swimmerId: props.swimmerId,
        groupSelectionId: props.groupSelectionId,
      });

    if (selection) {
      throw new Error('Swimmer already in selection');
    }

    this.selectionsRepository.addSwimmerToSelection(props);
  }

  async removeSwimmerFromSelection(props: RemoveSwimmerTeacherSelectionProps) {
    const selection =
      await this.selectionsRepository.findSelectionBySwimmerAndGroupSelection({
        swimmerId: props.swimmerId,
        groupSelectionId: props.groupSelectionId,
      });

    if (!selection) {
      throw new Error('Swimmer not in selection');
    }

    this.selectionsRepository.removeSwimmerFromSelection(props);
  }

  async getSelectionWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<FindSelectionGroupWithSwimmersResponseDTO> {
    let selectionGroup =
      await this.selectionsRepository.findAllWithSwimmersFromPeriodAndTeacher(
        props,
      );

    if (!selectionGroup) {
      selectionGroup = await this.selectionsRepository.createGroupSelection(
        props.teacherAuthId,
        props.periodId,
      );
    }

    return {
      groupSelection: selectionGroup,
    };
  }
}

export type UpdateSwimmerFromSelectionProps = {
  swimmerId: string;
  groupSelectionId: string;
};

export type RemoveSwimmerTeacherSelectionProps = {
  swimmerId: string;
  groupSelectionId: string;
};

export type GetSwimmersFromPeriodAndTeacherProps = {
  periodId: string;
  teacherAuthId: string;
};

export type ResetSwimmersFromGroupSelectionProps = {
  teacherAuthId: string;
  periodId: string;
};
