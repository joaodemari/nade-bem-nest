import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Auth, Prisma, Responsible, Swimmer } from '@prisma/client';
import {
  createResponsibleAndAuth,
  ResponsibleRepository,
  SwimmerWithPeriod,
  updateResponsibleAndAuth,
} from '../../../../domain/repositories/responsibles-repository';
import { Role } from '../../../../domain/enums/role.enum';

@Injectable()
export class PrismaResponsiblesRepository implements ResponsibleRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getSwimmersByResponsible(
    responsibleAuthId: string,
  ): Promise<SwimmerWithPeriod[]> {
    const swimmer = await this.prisma.swimmer.findMany({
      where: {
        Responsible: {
          authId: responsibleAuthId,
        },
      },
      include: {
        lastReportAccess: {
          include: {
            Period: true,
          },
        },
      },
    });

    return swimmer.map((swimmer) => ({
      ...swimmer,
      period: swimmer.lastReportAccess?.Period,
    }));
  }

  findByEmailWithAuth(email: string): Promise<Responsible & { auth: Auth }> {
    return this.prisma.responsible.findFirst({
      where: {
        auth: {
          email,
        },
      },
      include: {
        auth: true,
      },
    });
  }

  createResponsibleAndAuth(
    payload: createResponsibleAndAuth,
  ): Promise<Responsible & { auth: Auth }> {
    return this.prisma.responsible.create({
      data: {
        branch: {
          connect: {
            id: payload.branchId,
          },
        },
        auth: {
          create: {
            email: payload.email,
            password: payload.password,
            role: Role.Responsible,
            name: payload.name,
          },
        },
        swimmers: {
          connect: payload.swimmerNumbers.map((swimmerNumber) => ({
            memberNumber: swimmerNumber,
          })),
        },
      },
      include: {
        auth: true,
      },
    });
  }

  updateResponsibleAndAuth(
    payload: updateResponsibleAndAuth,
  ): Promise<Responsible & { auth: Auth }> {
    return this.prisma.responsible.update({
      where: {
        id: payload.id,
      },
      data: {
        branch: {
          connect: {
            id: payload.branchId,
          },
        },
        auth: {
          update: {
            name: payload.name,
          },
        },
        swimmers: {
          connect: payload.swimmerNumbers.map((swimmerNumber) => ({
            memberNumber: swimmerNumber,
          })),
        },
      },
      include: {
        auth: true,
      },
    });
  }
}
