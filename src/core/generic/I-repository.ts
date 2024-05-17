export abstract class IRepository<ENTITY> {
  // abstract create<Includes = ENTITY>(
  //   data: Includes,
  // ): Promise<void | ENTITY | any>;
  abstract delete(id: string): Promise<boolean | void | ENTITY>;
  abstract exists<Includes = Partial<ENTITY>>(
    data: Includes,
  ): Promise<boolean | ENTITY>;
  abstract findAll(): Promise<any>;
  abstract findById(id: string): Promise<void | ENTITY>;
}
