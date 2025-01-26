import { SwimmerEvo } from '../evo/entities/swimmer-evo-entity';
import { SwimmerInfoResponse } from '../../infra/http/dtos/swimmers/swimmerInfo.dto';
import { swimmerAndReport } from '../services/swimmers.service';
import { ListAllSwimmersProps } from '../../infra/http/dtos/ListSwimmers.dto';
import { Swimmer } from '@prisma/client';
import { string } from 'zod';
import { UpdateLevelAndReportProps } from '../services/reports/templates/postReport.service';
import { SwimmerAndSelctionsAndGroupSelectionsAndTeacher } from '../../infra/database/prisma/repositories/prisma-swimmers-repository';

export abstract class SwimmersRepository {
  abstract updateLevelAndReport(
    props: UpdateLevelAndReportProps,
  ): Promise<void>;

  abstract findByMemberNumber(memberNumber: number): Promise<Swimmer>;

  abstract querySwimmers({
    branchId,
    search,
  }: {
    branchId: string;
    search: string;
  }): Promise<SwimmerAndSelctionsAndGroupSelectionsAndTeacher[]>;

  abstract deleteDuplicates(): Promise<void>;
  abstract findManyByTeacher(
    teacherId: string,
    branchId: string,
  ): Promise<swimmerAndReport[]>;
  abstract countSwimmersWithoutReport(
    teacherAuthId: string,
    periodStartDate: Date,
  ): Promise<number>;
  abstract countSwimmers(teacherAuthId: string): Promise<number>;
  abstract findSwimmerAndReports(
    idMember: number,
  ): Promise<SwimmerInfoResponse | null>;

  abstract findManyPaginated({
    branchId,
    page,
    perPage,
    search,
  }: ListAllSwimmersProps): Promise<{
    swimmers: swimmerAndReport[];
    totalSwimmers: number;
  }>;

  abstract updateSwimmerTeacher(
    swimmerNumber: number,
    teacherId: string,
  ): Promise<void>;
  abstract upsertManyFromEvo(
    swimmers: SwimmerEvo[],
    branchId: string,
  ): Promise<void>;

  abstract createSwimmerFromEvo(
    swimmer: SwimmerEvo,
    branchId: string,
  ): Promise<Swimmer>;

  abstract updateLevelOfSwimmers(): Promise<void>;
}
