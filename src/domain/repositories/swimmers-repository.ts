import { SwimmerEvo } from '../evo/entities/swimmer-evo-entity';
import { SwimmerEntity } from '../entities/swimmer-entity';
import { IRepository } from '../../core/generic/I-repository';

export abstract class SwimmersRepository extends IRepository<SwimmerEntity> {
  abstract upsertManyFromEvo(swimmers: SwimmerEvo[]): Promise<void>;
  abstract deleteDuplicates(): Promise<void>;
  abstract findManyByTeacher(teacherNumber: number): Promise<SwimmerEntity[]>;
  abstract countSwimmersWithoutReport(
    teacherNumber: number,
    periodStartDate: Date,
  ): Promise<number>;
  abstract countSwimmers(teacherNumber: number): Promise<number>;
}
