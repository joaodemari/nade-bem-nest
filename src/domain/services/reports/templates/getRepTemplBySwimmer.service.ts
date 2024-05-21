import { Step, Area, Level } from '@prisma/client';
import { right } from '../../../../core/types/either';
import { LevelsRepository } from '../../../../domain/repositories/levels-repository';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { getLevelTemplateResponse } from '../../../../infra/http/dtos/reports/templates/getLevelTemplate.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetRepTemplBySwimmerService {
  constructor(
    private readonly levelsRepository: LevelsRepository,
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async execute(
    lastReportId: string | null,
  ): Promise<getLevelTemplateResponse> {
    let reportLevel: ({ areas: ({ steps: Step[] } & Area)[] } & Level) | null;
    let reportLevelWithSelectedSteps:
      | ({
          observation: string;
          areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
        } & Level)
      | null;
    if (!lastReportId) {
      reportLevel = await this.levelsRepository.findFirstLevel();
      reportLevelWithSelectedSteps = {
        ...reportLevel,
        observation: '',
        areas: reportLevel.areas.map((area) => ({
          ...area,
          lastReportStepId: area.steps[0].id,
          steps: area.steps,
        })),
      };
      return right(reportLevelWithSelectedSteps);
    }

    const lastReport =
      await this.reportsRepository.findReportAreasSelectedSteps(lastReportId);
    if (lastReport.approved) {
      reportLevel = await this.levelsRepository.findByLevelNumber(
        lastReport.level.levelNumber,
      );
    } else {
      reportLevel = { ...lastReport.level, areas: lastReport.areas };
      console.log(reportLevel);
    }

    reportLevelWithSelectedSteps = {
      ...reportLevel,
      observation: lastReport.observation,
      areas: lastReport.areas.map((area) => ({
        ...area,
        lastReportStepId: area.lastReportStepId,
        steps: area.steps,
      })),
    };

    return right(reportLevelWithSelectedSteps);
  }
}
