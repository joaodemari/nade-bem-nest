import {
  Area,
  Branch,
  Level,
  Period,
  Prisma,
  Report,
  Step,
  Swimmer,
  Teacher,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ReportsRepository } from '../../src/domain/repositories/reports-repository';
import { reportsDummyDB } from './dummyDB';

@Injectable()
export class InMemoryReportsRepository implements ReportsRepository {
  constructor() {}

  reports: Report[] = reportsDummyDB;
  create(data: Prisma.ReportCreateInput): Promise<Report> {
    throw new Error('Method not implemented.');
  }
  updateReportById(
    data: Prisma.ReportCreateInput,
    id: string,
  ): Promise<Report> {
    throw new Error('Method not implemented.');
  }
  deleteReportStepsByReportId(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateRightLevelsToReport(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteReportById(reportId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findReportsAreasStepsTeacherSwimmer(reportId: string): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
      } & Level)
    | null
  > {
    throw new Error('Method not implemented.');
  }
  findReportAreasSelectedSteps(reportId: string): Promise<{
    level: Level;
    approved: boolean;
    observation: string;
    areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
  } | null> {
    throw new Error('Method not implemented.');
  }
  findManyBySwimmers(props: {
    swimmerIds: string[];
    periodId: string;
  }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        branch: Branch;
        areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
      } & Level)[]
    | null
  > {
    throw new Error('Method not implemented.');
  }
  findManyByTeacher(props: { teacherId: string; periodId: string }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        branch: Branch;
        areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
      } & Level)[]
    | null
  > {
    throw new Error('Method not implemented.');
  }
  findOneById(props: { reportId: string }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        branch: Branch;
        areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
      } & Level)
    | null
  > {
    throw new Error('Method not implemented.');
  }
  deleteInvalidReports(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
