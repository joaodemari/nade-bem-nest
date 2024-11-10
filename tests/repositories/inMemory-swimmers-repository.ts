// import { Injectable } from '@nestjs/common';
// import { SwimmersRepository } from '../../src/domain/repositories/swimmers-repository';
// import { EnvService } from '../../src/infra/env/env.service';
// import PeriodsRepository from '../../src/domain/repositories/periods-repository';
// import { Swimmer } from '@prisma/client';
// import { ListAllSwimmersProps } from '../../src/infra/http/dtos/ListSwimmers.dto';
// import { SwimmerEvo } from '../../src/domain/evo/entities/swimmer-evo-entity';
// import { SwimmerInfoResponse } from '../../src/infra/http/dtos/swimmers/swimmerInfo.dto';

// @Injectable()
// export class InMemorySwimmersRepository implements SwimmersRepository {
//   constructor(
//     private readonly periodsRepository: PeriodsRepository,
//     private readonly env: EnvService,
//   ) {}

//   swimmers: Swimmer[] = [
//     {
//       actualLevelName: 'Lambari',
//       branchId: 'raiarCinquentenario',
//       id: 'swimmer1',
//       isActive: true,
//       lastAccess: new Date(),
//       lastReport: new Date(),
//       lastReportId: 'ultimoReportSwimmer1',
//       memberNumber: 1,
//       name: 'Luke Skywalker',
//       photoUrl: '',
//       teacherNumber: 1,
//     },
//     {
//       actualLevelName: 'Lambari',
//       branchId: 'raiarCinquentenario',
//       id: 'swimmer2',
//       isActive: true,
//       lastAccess: new Date(),
//       lastReport: new Date(),
//       lastReportId: 'ultimoReportSwimmer2',
//       memberNumber: 2,
//       name: 'Leia Skywalker',
//       photoUrl: null,
//       teacherNumber: 1,
//     },
//   ];

//   async updateSwimmerTeacher(
//     swimmerNumber: number,
//     teacherNumber: number,
//   ): Promise<void> {
//     const swimmer = this.swimmers.find((s) => s.memberNumber === swimmerNumber);

//     if (!swimmer) return;

//     swimmer.teacherNumber = teacherNumber;
//   }

//   async countSwimmers(teacherNumber: number): Promise<number> {
//     const swimmersCount = this.swimmers.filter(
//       (s) => s.teacherNumber === teacherNumber,
//     ).length;

//     return swimmersCount;
//   }

//   async countSwimmersWithoutReport(
//     teacherNumber: number,
//     periodStartDate: Date,
//   ): Promise<number> {
//     throw new Error('Not Implemented');
//   }

//   // findInfoToUpdateSwimmerTeacher = async (swimmerId: string) => {
//   //   const swimmer = await this.prisma.swimmer.findFirst({
//   //     where: {
//   //       id: swimmerId,
//   //     },
//   //     select: {
//   //       memberNumber: true,
//   //       teacherNumber: true,
//   //     },
//   //   });

//   //   return swimmer;
//   // };

//   async findManyByTeacher(teacherNumber: number, branchId: string) {
//     throw new Error('Not Implemented');
//     return [];
//     // if (!teacherNumber) return [];

//     // const where: Prisma.SwimmerWhereInput =
//     //   teacherNumber === 8888
//     //     ? {
//     //         branchId,
//     //       }
//     //     : {
//     //         teacherNumber,
//     //         branchId,
//     //       };

//     // const swimmers = await this.prisma.swimmer.findMany({
//     //   where,
//     //   orderBy: {
//     //     lastReport: 'asc',
//     //   },
//     //   include: {
//     //     Report: { orderBy: { createdAt: 'asc' } },
//     //     lastReportAccess: true,
//     //   },
//     // });

//     // // swimmers = swimmers.sort((a, b) => {
//     // //     const aLastReport = a.lastReport ?? new Date();
//     // //     const bLastReport = b.lastReport ?? new Date();

//     // //     console.log("aLastReport", aLastReport);
//     // //     console.log("bLastReport", bLastReport);
//     // //     if (aLastReport > bLastReport) {
//     // //         return -1;
//     // //     }
//     // //     if (aLastReport < bLastReport) {
//     // //         return 1;
//     // //     }
//     // //     return 0;
//     // // });

//     // return swimmers.map((swimmer) => {
//     //   return {
//     //     ...swimmer,
//     //     lastReportPeriodId: swimmer.lastReportAccess?.periodId,
//     //   };
//     // });
//   }

//   async findManyPaginated({
//     branchId,
//     page,
//     perPage,
//     search,
//   }: ListAllSwimmersProps): Promise<{
//     swimmers: Swimmer[];
//     totalSwimmers: number;
//   }> {
//     throw new Error('Not Implemented');
//     return {
//       swimmers: [],
//       totalSwimmers: 0,
//     };
//     // const where: Prisma.SwimmerWhereInput = {
//     //   branchId,
//     // };

//     // if (Number.isNaN(parseInt(search))) {
//     //   where.name = {
//     //     contains: search,
//     //     mode: 'insensitive',
//     //   };
//     // } else {
//     //   where.memberNumber = parseInt(search);
//     // }
//     // const swimmers = await this.prisma.swimmer.findMany({
//     //   where,
//     //   skip: (page - 1) * perPage,
//     //   take: perPage,
//     // });

//     // const swimmersCount = await this.prisma.swimmer.count({
//     //   where,
//     // });

//     // // swimmers = swimmers.sort((a, b) => {
//     // //     const aLastReport = a.lastReport ?? new Date();
//     // //     const bLastReport = b.lastReport ?? new Date();

//     // //     console.log("aLastReport", aLastReport);
//     // //     console.log("bLastReport", bLastReport);
//     // //     if (aLastReport > bLastReport) {
//     // //         return -1;
//     // //     }
//     // //     if (aLastReport < bLastReport) {
//     // //         return 1;
//     // //     }
//     // //     return 0;
//     // // });

//     // return { swimmers, totalSwimmers: swimmersCount };
//   }

//   async upsertManyFromEvo(swimmersInEvo: SwimmerEvo[]): Promise<void> {
//     throw new Error('Not Implemented');
//     // if (swimmersInEvo.length === 0) return;

//     // await Promise.all(
//     //   swimmersInEvo.map(async (swimmer) => {
//     //     const data = SwimmerEvoMapper.toPersistence(swimmer);
//     //     await this.prisma.swimmer
//     //       .upsert({
//     //         where: {
//     //           memberNumber: swimmer.idMember,
//     //         },
//     //         update: data,
//     //         create: data,
//     //       })
//     //       .catch((error) => {
//     //         console.error(error);
//     //       });
//     //   }),
//     // );
//   }

//   async upsertOneFromEvo(swimmer: SwimmerEvo): Promise<Swimmer | null> {
//     throw new Error('Not Implemented');
//     // const data = SwimmerEvoMapper.toPersistence(swimmer);
//     // return this.prisma.swimmer
//     //   .upsert({
//     //     where: {
//     //       memberNumber: swimmer.idMember,
//     //     },
//     //     update: data,
//     //     create: data,
//     //   })
//     //   .catch((error) => {
//     //     console.error(error);
//     //     return null;
//     //   });
//   }

//   async deleteDuplicates(): Promise<void> {
//     throw new Error('Not Implemented');
//     // const swimmers = await this.prisma.swimmer.findMany({
//     //   select: {
//     //     memberNumber: true,
//     //     id: true,
//     //   },
//     // });

//     // const memberNumbers = swimmers.map((swimmer) => swimmer.memberNumber);

//     // const duplicates = memberNumbers.filter(
//     //   (memberNumber, index) => memberNumbers.indexOf(memberNumber) !== index,
//     // );

//     // duplicates.map(async (memberNumber) => {
//     //   const swimmer = swimmers.find(
//     //     (swimmer) => swimmer.memberNumber === memberNumber,
//     //   );
//     //   if (swimmer) {
//     //     await this.prisma.swimmer.delete({
//     //       where: {
//     //         id: swimmer.id,
//     //       },
//     //     });
//     //   }
//     // });
//   }

//   async findById(id: string) {
//     const swimmer = this.swimmers.find((s) => s.id === id);
//     return swimmer;
//     // const swimmer = await this.prisma.swimmer.findFirst({
//     //   where: { id },
//     // });

//     // if (!swimmer) {
//     //   return null;
//     // }

//     // return swimmer;
//   }

//   async findSwimmerAndReports(idMember: number) {
//     throw new Error('Not Implemented');
//     return {
//       swimmer: null,
//       reports: [],
//     };
//     // const swimmer = await this.prisma.swimmer.findFirst({
//     //   where: { memberNumber: idMember },
//     //   include: {
//     //     Report: {
//     //       select: {
//     //         id: true,
//     //         level: true,
//     //         teacher: { select: { name: true, photoUrl: true } },
//     //       },
//     //     },
//     //     actualLevel: true,
//     //     Teacher: true,
//     //   },
//     // });
//     // if (!swimmer) {
//     //   return null;
//     // }

//     // return {
//     //   swimmer: {
//     //     name: swimmer.name,
//     //     actualLevel: swimmer.actualLevel.name,
//     //     photoUrl: swimmer.photoUrl,
//     //   },
//     //   reports: swimmer.Report.map((report) => {
//     //     return {
//     //       period: report.id,
//     //       teacherName: capitalizeName(
//     //         report.teacher?.name ?? swimmer.Teacher.name,
//     //       ),
//     //       teacherPhoto: report.teacher?.photoUrl ?? 'sem url',
//     //       level: report.level.name,
//     //       id: report.id,
//     //     };
//     //   }),
//     // };
//   }

//   async createSwimmerFromEvoService(
//     memberNumber: number,
//   ): Promise<SwimmerInfoResponse | null> {
//     throw new Error('Not Implemented');
//     // try {
//     //   const url = `https://evo-integracao.w12app.com.br/api/v1/members/${memberNumber}`;
//     //   const evo_cred = this.env.get('EVO_CRED');
//     //   const credentials = btoa(evo_cred);
//     //   const { data }: { data: SwimmerEvo } = await axios.get(url, {
//     //     headers: {
//     //       Authorization: `Basic ${credentials}`, // Use btoa here
//     //     },
//     //   });

//     //   const swimmer = await this.upsertOneFromEvo(data);
//     //   return {
//     //     swimmer: {
//     //       name: swimmer.name,
//     //       actualLevel: swimmer.actualLevelName,
//     //       photoUrl: swimmer.photoUrl,
//     //     },
//     //     reports: [],
//     //   };
//     // } catch (e) {
//     //   console.log(e);
//     //   return null;
//     // }
//   }
// }
