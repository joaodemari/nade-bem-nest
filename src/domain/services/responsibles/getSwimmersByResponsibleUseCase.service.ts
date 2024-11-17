import { Injectable } from '@nestjs/common';
import { ResponsibleRepository } from '../../repositories/responsibles-repository';

@Injectable()
export class GetSwimmersByResponsibleUseCase {
  constructor(private readonly responsibleRepository: ResponsibleRepository) {}

  async execute(resposibleAuthId: string) {
    return await this.responsibleRepository.getSwimmersByResponsible(resposibleAuthId);
  }
}
