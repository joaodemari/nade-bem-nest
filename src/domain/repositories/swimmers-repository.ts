import { SwimmerEvo } from '../evo/entities/swimmer-evo-entity';
import { SwimmerInfoResponse } from '../../infra/http/dtos/swimmers/swimmerInfo.dto';
import { swimmerAndReport } from '../services/swimmers.service';
import { ListAllSwimmersProps } from '../../infra/http/dtos/ListSwimmers.dto';
import { Swimmer } from '@prisma/client';

export abstract class SwimmersRepository {
  abstract upsertManyFromEvo(swimmers: SwimmerEvo[]): Promise<void>;
  abstract deleteDuplicates(): Promise<void>;
  abstract findManyByTeacher(
    teacherId: string,
    branchId: string,
  ): Promise<swimmerAndReport[]>;
  abstract countSwimmersWithoutReport(
    teacherNumber: number,
    periodStartDate: Date,
  ): Promise<number>;
  abstract countSwimmers(teacherNumber: number): Promise<number>;
  abstract findSwimmerAndReports(
    idMember: number,
  ): Promise<SwimmerInfoResponse | null>;
  abstract createSwimmerFromEvoService(
    memberNumber: number,
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
    teacherNumber: number,
  ): Promise<void>;
}
