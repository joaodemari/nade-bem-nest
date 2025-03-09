import {
  Area,
  Level,
  Report,
  Step,
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

export type SelectionReportInfoSelectedSteps = SwimmerPeriodTeacherSelection & {
  Report: Report & {
    level: Level & {
      areas: (Area & {
        steps: Step[];
      })[];
    };
    selectedSteps: Step[];
  };
};

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
        report?: Report;
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

  abstract findAllWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: {
        report?: Report;
        swimmer: SwimmerAndTeacher;
      }[];
    }
  >;

  abstract findById(
    id: string,
  ): Promise<SelectionReportInfoSelectedSteps | null>;

  abstract findLastSelectionBySwimmerIdAndSelectionId(
    selectionId: string,
    swimmerId: string,
  ): Promise<SelectionReportInfoSelectedSteps | null>;
}

export type SwimmerAndTeacher = Swimmer & {
  Teacher: Teacher;
};
