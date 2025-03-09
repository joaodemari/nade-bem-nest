import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import {
  PageNumberPaginationOptions,
  pagination,
} from 'prisma-extension-pagination';
import { ExtendedPrismaClient } from './prisma.extension';

export type PrismaServiceWithExtensions = ReturnType<
  PrismaService['withExtensions']
>;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  withExtensions() {
    return this.$extends(pagination());
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
