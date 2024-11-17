import { Auth, Period, Responsible, Swimmer } from '@prisma/client';

export abstract class ResponsibleRepository {
  abstract findByEmailWithAuth(
    email: string,
  ): Promise<Responsible & { auth: Auth }>;
  abstract createResponsibleAndAuth(
    payload: createResponsibleAndAuth,
  ): Promise<Responsible & { auth: Auth }>;
  abstract getSwimmersByResponsible(
    responsibleAuthId: string,
  ): Promise<SwimmerWithPeriod[]>;
}

export type SwimmerWithPeriod = Swimmer & {
  period: Period;
};

export interface createResponsibleAndAuth {
  email: string;
  password: string;
  name: string;
  swimmerNumbers: number[];
  branchId: string;
}
