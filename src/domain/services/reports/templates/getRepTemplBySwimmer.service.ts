import { Step, Area, Level, Report } from '@prisma/client';
import { LevelsRepository } from '../../../../domain/repositories/levels-repository';
import { ReportsRepository } from '../../../../domain/repositories/reports-repository';
import { Injectable } from '@nestjs/common';
import {
  getLevelTemplateResponse,
  LevelAreasSteps,
  ReportLevelAreaStepsSelected,
} from '../../../../infra/http/dtos/reports/templates/getLevelTemplate.dto';
import {
  SelectionReportInfoSelectedSteps,
  SelectionsRepository,
} from '../../../repositories/selections-repository';

@Injectable()
export class GetRepTemplBySwimmerService {
  constructor(
    private readonly levelsRepository: LevelsRepository,
    private readonly reportsRepository: ReportsRepository,
    private readonly selectionsRepository: SelectionsRepository,
  ) {}

  async getReportToTemplate(
    selectionId: string,
  ): Promise<SelectionReportInfoSelectedSteps | null> {
    const selection = await this.selectionsRepository.findById(selectionId);
    if (selection.Report) {
      return selection;
    }

    const lastSelectionBefore =
      await this.selectionsRepository.findLastSelectionBySwimmerIdAndSelectionId(
        selection.swimmerId,
        selectionId,
      );

    if (lastSelectionBefore) {
      return lastSelectionBefore;
    }

    return null;
  }

  async getBySelectionId(
    selectionId: string,
  ): Promise<ReportLevelAreaStepsSelected> {
    const selection = await this.selectionsRepository.findById(selectionId);

    const selectionReportTemplate = await this.getReportToTemplate(selectionId);

    let reportLevel: LevelAreasSteps;
    let reportLevelAreasSteps: ReportLevelAreaStepsSelected;

    if (!selectionReportTemplate) {
      reportLevel = await this.levelsRepository.findFirstLevel();
      reportLevelAreasSteps = {
        level: {
          ...reportLevel,
          areas: reportLevel.areas.map((area) => ({
            ...area,
            steps: area.steps,
            selectedStepId: area.steps[0].id,
          })),
        },
        observation: '',
        approved: false,
      };
      return reportLevelAreasSteps;
    }

    const Report = selectionReportTemplate.Report;
    reportLevel =
      await this.levelsRepository.findLevelAndAreasAndStepsByLevelId(
        Report.levelId,
      );

    if (Report.approved && Report.level.levelNumber < 5) {
      reportLevel =
        await this.levelsRepository.findLevelAndAreasAndStepsByLevelNumber(
          reportLevel.levelNumber + 1,
        );
    }

    reportLevelAreasSteps = {
      approved: Report.approved,
      observation: '',
      level: {
        ...reportLevel,
        areas: reportLevel.areas.map((area) => ({
          ...area,
          selectedStepId: area.steps.find((step) =>
            Report.selectedSteps.some(
              (selectedStep) => selectedStep.id === step.id,
            ),
          ).id,
          steps: area.steps,
        })),
      },
    };

    return reportLevelAreasSteps;
  }

  //   async execute(
  //     lastReportId: string | null,
  //   ): Promise<getLevelTemplateResponse> {
  //     let reportLevel: ({ areas: ({ steps: Step[] } & Area)[] } & Level) | null;
  //     let reportLevelWithSelectedSteps:
  //       | ({
  //           observation: string;
  //           areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
  //         } & Level)
  //       | null;
  //     if (!lastReportId || lastReportId === 'new') {
  //       reportLevel = await this.levelsRepository.findFirstLevel();
  //       reportLevelWithSelectedSteps = {
  //         ...reportLevel,
  //         observation: '',
  //         areas: reportLevel.areas.map((area) => ({
  //           ...area,
  //           lastReportStepId: area.steps[0].id,
  //           steps: area.steps,
  //         })),
  //       };
  //       return reportLevelWithSelectedSteps;
  //     }

  //     const lastReport =
  //       await this.reportsRepository.findReportAreasSelectedSteps(lastReportId);
  //     if (lastReport.approved) {
  //       reportLevel =
  //         await this.levelsRepository.findLevelAndAreasAndStepsByLevelNumber(
  //           lastReport.level.levelNumber,
  //         );
  //     } else {
  //       reportLevel = { ...lastReport.level, areas: lastReport.areas };
  //       console.log(reportLevel);
  //     }

  //     reportLevelWithSelectedSteps = {
  //       ...reportLevel,
  //       observation: lastReport.observation,
  //       areas: lastReport.areas.map((area) => ({
  //         ...area,
  //         lastReportStepId: area.lastReportStepId,
  //         steps: area.steps,
  //       })),
  //     };

  //     return reportLevelWithSelectedSteps;
  //   }
}
