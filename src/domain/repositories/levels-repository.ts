import { Step, Area } from '@prisma/client';

export abstract class LevelsRepository {
  abstract findLevelAndAreasAndSteps(levelId: string): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  >;

  abstract findFirstLevel(): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  >;

  abstract findByLevelNumber(levelNumber: number): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & {
      id: string;
      name: string;
      levelNumber: number;
      branchId: string;
    }
  >;
}
