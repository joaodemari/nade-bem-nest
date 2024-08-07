import { SwimmerEvo } from '../evo/entities/swimmer-evo-entity';
import { SwimmerEntity } from '../entities/swimmer-entity';
import { IRepository } from '../../core/generic/I-repository';
import { SwimmerInfoResponse } from '../../infra/http/dtos/swimmers/swimmerInfo.dto';
import { swimmerAndPeriod } from '../services/swimmers.service';

export abstract class SwimmersRepository extends IRepository<SwimmerEntity> {
  abstract upsertManyFromEvo(swimmers: SwimmerEvo[]): Promise<void>;
  abstract deleteDuplicates(): Promise<void>;
  abstract findManyByTeacher(
    teacherNumber: number,
    branchId: string,
  ): Promise<swimmerAndPeriod[]>;
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
}
