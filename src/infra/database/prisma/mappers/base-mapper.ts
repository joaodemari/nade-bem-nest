export abstract class IPrismaMapper<ENTITY, PRISMA> {
  abstract toDomain(inPrisma: PRISMA): ENTITY;
  abstract toPersistence(inEntity: ENTITY): PRISMA;
}
