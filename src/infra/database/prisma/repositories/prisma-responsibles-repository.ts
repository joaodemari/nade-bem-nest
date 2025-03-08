import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Auth, Prisma, Responsible, Swimmer } from '@prisma/client';
import {
  createResponsibleAndAuth,
  ResponsibleRepository,
  SwimmerWithPeriod,
  updateResponsibleAndAuth,
} from '../../../../domain/repositories/responsibles-repository';
import { Role } from '../../../../domain/enums/role.enum';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_INJECTION_TOKEN } from '../../PrismaDatabase.module';
import { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PrismaResponsiblesRepository implements ResponsibleRepository {
  private readonly prisma: ExtendedPrismaClient;

  constructor(
    @Inject(forwardRef(() => PRISMA_INJECTION_TOKEN))
    prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.prisma = prismaService.client;
  }
  async getSwimmersByResponsible(
    responsibleAuthId: string,
  ): Promise<SwimmerWithPeriod[]> {
    throw new Error('Method not implemented.');
    const swimmer = await this.prisma.swimmer.findMany({
      where: {
        Responsible: {
          authId: responsibleAuthId,
        },
      },
    });

    return swimmer.map((swimmer) => ({
      ...swimmer,
      period: null,
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
