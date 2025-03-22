import {
  Report,
  SwimmerPeriodTeacherSelection,
  TeacherPeriodGroupSelection,
} from '@prisma/client';
import { GetBatchResult } from '@prisma/client/runtime/library';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination';
import {
  SelectionReportInfoSelectedSteps,
  SelectionsRepository,
  SwimmerAndTeacher,
} from '../../src/domain/repositories/selections-repository';
import {
  GetSwimmersFromPeriodAndTeacherProps,
  RemoveSwimmerTeacherSelectionProps,
  ResetSwimmersFromGroupSelectionProps,
  UpdateSwimmerFromSelectionProps,
} from '../../src/domain/services/selection/selection.service';
import { SelectionSwimmersByTeacherQueryDTO } from '../../src/infra/http/dtos/swimmers/selection-swimmers/selection-swimmers.dto';
import {
  swimmerPeriodTeacherSelectionsDummyDB,
  teacherPeriodGroupSelectionsDummyDB,
} from './dummyDB';

export class InMemorySelectionsRepository implements SelectionsRepository {
  selections: SwimmerPeriodTeacherSelection[] =
    swimmerPeriodTeacherSelectionsDummyDB;

  groupSelections: TeacherPeriodGroupSelection[] =
    teacherPeriodGroupSelectionsDummyDB;

  constructor() {}
  createUnexistantSelections(): Promise<GetBatchResult> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<SelectionReportInfoSelectedSteps | null> {
    throw new Error('Method not implemented.');
  }
  findLastSelectionBySwimmerIdAndSelectionId(
    selectionId: string,
    swimmerId: string,
  ): Promise<SelectionReportInfoSelectedSteps | null> {
    throw new Error('Method not implemented.');
  }
  createGroupSelection(
    teacherId: string,
    periodId: string,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: { swimmer: SwimmerAndTeacher; report: Report }[];
    }
  > {
    throw new Error('Method not implemented.');
  }
  findAllWithSwimmersFromPeriodAndTeacher(
    props: GetSwimmersFromPeriodAndTeacherProps,
  ): Promise<
    TeacherPeriodGroupSelection & {
      swimmerSelections: { swimmer: SwimmerAndTeacher; report: Report }[];
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
