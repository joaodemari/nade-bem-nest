import { Responsible, Auth } from '@prisma/client';
import {
  createResponsibleAndAuth,
  ResponsibleRepository,
  SwimmerWithPeriod,
  updateResponsibleAndAuth,
} from '../../src/domain/repositories/responsibles-repository';

export class InMemoryResponsibleRepository implements ResponsibleRepository {
  findByEmailWithAuth(email: string): Promise<Responsible & { auth: Auth }> {
    throw new Error('Method not implemented.');
  }
  createResponsibleAndAuth(
    payload: createResponsibleAndAuth,
  ): Promise<Responsible & { auth: Auth }> {
    throw new Error('Method not implemented.');
  }
  getSwimmersByResponsible(
    responsibleAuthId: string,
  ): Promise<SwimmerWithPeriod[]> {
    throw new Error('Method not implemented.');
  }
  updateResponsibleAndAuth(
    payload: updateResponsibleAndAuth,
  ): Promise<Responsible & { auth: Auth }> {
    throw new Error('Method not implemented.');
  }
}
