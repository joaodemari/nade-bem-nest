import { BaseEntity } from './base-entity';
import { Injectable } from '@nestjs/common';
import { IRepository } from './I-repository';

@Injectable()
export class BaseService<
  ENTITY extends BaseEntity<unknown>,
  REPO extends IRepository<ENTITY>,
> {
  constructor(protected readonly repository: REPO) {}

  async findAll(): Promise<ENTITY[]> {
    return await this.repository.findAll();
  }

  async findById(id: string): Promise<ENTITY | void> {
    return await this.repository.findById(id);
  }
  async delete(id: string): Promise<ENTITY | boolean | void> {
    return await this.repository.delete(id);
  }
}
