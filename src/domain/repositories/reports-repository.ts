import { IRepository } from 'src/core/generic/I-repository';
import { ReportEntity } from '../entities/ReportEntity';
import { Area, Level, Period, Step, Swimmer, Teacher } from '@prisma/client';

export abstract class ReportsRepository extends IRepository<ReportEntity> {
  abstract findReportsAndAreasAndSteps(reportId: string): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)
    | null
  >;
}
