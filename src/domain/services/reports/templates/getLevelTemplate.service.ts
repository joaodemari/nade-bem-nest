import { NoCompleteInformation } from 'src/core/errors/no-complete-information-error';
import { left, right } from 'src/core/types/either';
import { LevelsRepository } from 'src/domain/repositories/levels-repository';
import { getLevelTemplateResponse } from 'src/infra/http/dtos/reports/templates/getLevelTemplate.dto';

export class GetLevelTempleteService {
  constructor(private readonly levelRepository: LevelsRepository) {}

  async execute(levelId: string): Promise<getLevelTemplateResponse> {
    if (!levelId) {
      return left(new NoCompleteInformation('levelId'));
    }
    const level = await this.levelRepository.findLevelAndAreasAndSteps(levelId);

    const response = {
      ...level,
      areas: level.areas.map((area) => ({
        ...area,
        lastReportStepId: area.steps[0].id,
      })),
    };
    return right(response);
  }
}
