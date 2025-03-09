import { Injectable } from '@nestjs/common';
import {
  GetVisitsByRangeProps,
  SessionsRepository,
} from '../../repositories/sessions-repository';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionsRepository) {}

  async getVisitsByRange(props: GetVisitsByRangeProps) {
    return await this.repository.getVisitsByRange(props);
  }
}
