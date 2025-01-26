import {
  Swimmer,
  SwimmerPeriodTeacherSelection,
  Teacher,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import {
  GetSwimmersFromPeriodAndTeacherProps,
  RemoveSwimmerTeacherSelectionProps,
  ResetSwimmersFromGroupSelectionProps,
  UpdateSwimmerFromSelectionProps,
} from '../services/selection/selection.service';
import { SelectionSwimmersByTeacherQueryDTO } from '../../infra/http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination/dist/types';

export abstract class SelectionsRepository {
  abstract findSelectionBySwimmerAndGroupSelection(props: {
    swimmerId: string;
    groupSelectionId: string;
  }): Promise<SwimmerPeriodTeacherSelection | null>;

  abstract resetSwimmersFromSelection(
    props: ResetSwimmersFromGroupSelectionProps,
  ): Promise<void>;

  abstract findSwimmersByBranchAndPeriodPaginated(
    props: SelectionSwimmersByTeacherQueryDTO,
  ): Promise<[SwimmerAndTeacher[], PageNumberPaginationMeta<true>]>;

  abstract createGroupSelection(
    teacherId: string,
    periodId: string,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        swimmer: SwimmerAndTeacher;
      }[];
    }
  >;

  abstract addSwimmerToSelection(
    props: UpdateSwimmerFromSelectionProps,
  ): Promise<void>;

  abstract removeSwimmerFromSelection(
    props: RemoveSwimmerTeacherSelectionProps,
  ): Promise<void>;

  abstract findWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        swimmer: SwimmerAndTeacher;
      }[];
    }
  >;
}

export type SwimmerAndTeacher = Swimmer & {
  Teacher: Teacher;
};
