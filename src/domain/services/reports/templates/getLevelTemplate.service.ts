import { Injectable } from '@nestjs/common';
import { LevelsRepository } from '../../../../domain/repositories/levels-repository';
import { getLevelTemplateResponse } from '../../../../infra/http/dtos/reports/templates/getLevelTemplate.dto';

@Injectable()
export class GetLevelTempleteService {
  constructor(private readonly levelRepository: LevelsRepository) {}

  async execute(levelId: string): Promise<getLevelTemplateResponse> {
    if (!levelId) {
      throw new Error('Level not found');
    }
    const level = await this.levelRepository.findLevelAndAreasAndSteps(levelId);

    const response = {
      ...level,
      areas: level.areas.map((area) => ({
        ...area,
        lastReportStepId: area.steps[0].id,
      })),
    };
    return response;
  }
}
