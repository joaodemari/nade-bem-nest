import { IRepository } from 'src/core/generic/I-repository';
import { PrismaService } from '../prisma.service';
import { BaseEntity } from 'src/core/generic/base-entity';

export class PrismaBaseRepository<ENTITY extends BaseEntity<unknown>>
  implements IRepository<ENTITY>
{
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly table: string,
  ) {}

  // async create<ENTITY>(data: ENTITY): Promise<ENTITY> {
  //   const result = await this.prisma[this.table].create({ ...data });

  //   return result;
  // }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma[this.table].delete({
      where: { id },
    });

    if (!result) {
      return false;
    }

    return true;
  }

  async exists<Includes = Partial<ENTITY>>(
    data: Includes,
  ): Promise<ENTITY | null> {
    const result = this.prisma[this.table].findFirst({
      where: data,
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async findAll(): Promise<ENTITY[]> {
    return await this.prisma[this.table].findMany();
  }

  async findById(id: string): Promise<ENTITY | null> {
    const element = await this.prisma[this.table].findFirst({
      where: {
        id,
      },
    });

    if (!element) {
      return null;
    }

    return element;
  }
}
