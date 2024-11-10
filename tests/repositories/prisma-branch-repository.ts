// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { BranchRepository } from '../../../../domain/repositories/branches-repository';
// import { Branch, Prisma } from '@prisma/client';

// @Injectable()
// export class PrismaBranchRepository implements BranchRepository {
//   constructor(private readonly prisma: PrismaService) {}
//   async getDefaultTeacher(branchId: string): Promise<number> {
//     return 4;
//   }

//   async createBranch(branch: Prisma.BranchCreateInput): Promise<Branch> {
//     const inPrisma = await this.prisma.branch.create({ data: branch });
//     return inPrisma;
//   }

//   async getBranchToken(branchId: string): Promise<string> {
//     const branch = await this.prisma.branch.findFirst({
//       where: {
//         id: branchId,
//       },
//       select: {
//         apiKey: true,
//       },
//     });

//     return branch.apiKey;
//   }

//   async getBranchesByAuthId(authId: string): Promise<Branch[]> {
//     const branches = await this.prisma.branch.findMany({
//       where: {
//         branchTeachers: {
//           some: {
//             teacher: {
//               authId,
//             },
//           },
//         },
//       },
//     });

//     return branches;
//   }
// }
