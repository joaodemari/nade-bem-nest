import { Injectable } from '@nestjs/common';
import { LevelsRepository } from '../../src/domain/repositories/levels-repository';
import { Step, Area, Level } from '@prisma/client';
import { levelsDummyDB } from './dummyDB';

@Injectable()
export class InMemoryLevelsRepository implements LevelsRepository {
  constructor() {}

  levels: Level[] = levelsDummyDB;

  findLevelById(
    levelId: string,
  ): Promise<Level & { areas: (Area & { steps: Step[] })[] }> {
    throw new Error('Method not implemented.');
  }

  findLevelAndAreasAndStepsByLevelId(levelId: string): Promise<
    { areas: ({ steps: Step[] } & Area)[] } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  > {
    throw new Error('Method not implemented.');
  }
  findFirstLevel(): Promise<
    { areas: ({ steps: Step[] } & Area)[] } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  > {
    throw new Error('Method not implemented.');
  }
  findLevelAndAreasAndStepsByLevelNumber(levelNumber: number): Promise<
    { areas: ({ steps: Step[] } & Area)[] } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  > {
    throw new Error('Method not implemented.');
  }
}
