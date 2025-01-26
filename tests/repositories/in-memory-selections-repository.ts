import {
  Swimmer,
  SwimmerPeriodTeacherSelection,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import {
  SelectionsRepository,
  SwimmerAndTeacher,
} from '../../src/domain/repositories/selections-repository';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination';
import {
  ResetSwimmersFromGroupSelectionProps,
  UpdateSwimmerFromSelectionProps,
  RemoveSwimmerTeacherSelectionProps,
  GetSwimmersFromPeriodAndTeacherProps,
} from '../../src/domain/services/selection/selection.service';
import { SelectionSwimmersByTeacherQueryDTO } from '../../src/infra/http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';

export class InMemorySelectionsRepository implements SelectionsRepository {
  constructor() {}
  createGroupSelection(
    teacherId: string,
    periodId: string,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: { swimmer: SwimmerAndTeacher }[];
    }
  > {
    throw new Error('Method not implemented.');
  }
  findWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: { swimmer: SwimmerAndTeacher }[];
    }
  > {
    throw new Error('Method not implemented.');
  }
  findSwimmersByBranchAndPeriodPaginated(
    props: SelectionSwimmersByTeacherQueryDTO,
  ): Promise<[SwimmerAndTeacher[], PageNumberPaginationMeta<true>]> {
    throw new Error('Method not implemented.');
  }
  findSelectionBySwimmerAndGroupSelection(props: {
    swimmerId: string;
    groupSelectionId: string;
  }): Promise<SwimmerPeriodTeacherSelection | null> {
    throw new Error('Method not implemented.');
  }
  resetSwimmersFromSelection(
    props: ResetSwimmersFromGroupSelectionProps,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addSwimmerToSelection(props: UpdateSwimmerFromSelectionProps): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeSwimmerFromSelection(
    props: RemoveSwimmerTeacherSelectionProps,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
