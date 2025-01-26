import { Session } from '@prisma/client';
import {
  GetVisitsByRangeProps,
  SessionsRepository,
} from '../../src/domain/repositories/sessions-repository';

export class InMemorySessionsRepository implements SessionsRepository {
  constructor() {}
  getVisitsByRange(props: GetVisitsByRangeProps): Promise<{ visits: number }> {
    throw new Error('Method not implemented.');
  }

  sessions: Session[] = [];
}
