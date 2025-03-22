import { Step, Area, Level } from '@prisma/client';

export abstract class LevelsRepository {
  abstract findLevelAndAreasAndStepsByLevelId(levelId: string): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & Level
  >;

  abstract findFirstLevel(): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & Level
  >;

  abstract findLevelAndAreasAndStepsByLevelNumber(levelNumber: number): Promise<
    {
      areas: ({
        steps: Step[];
      } & Area)[];
    } & Level
  >;
}
