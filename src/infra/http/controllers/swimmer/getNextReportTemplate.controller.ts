// import { Area, Level, PrismaClient, Step } from '@prisma/client';
// import { Response } from 'express';

// const prisma = new PrismaClient();

// export default async (
//   req: AuthenticatedRequest & {
//     query: {
//       levelId?: string;
//     };
//   },
//   res: Response,
// ) => {
//   try {
//     let lastReportLevel:
//       | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
//       | null;
//     let lastReportLevelWithSelectedSteps:
//       | ({
//           observation: string;
//           areas: ({
//             lastReportStepId: string;
//             steps: Step[];
//           } & Area)[];
//         } & Level)
//       | null;

//     if (req.query.levelId) {
//       lastReportLevel = await prisma.level.findFirst({
//         where: {
//           id: req.query.levelId,
//         },
//         include: {
//           areas: { include: { steps: { orderBy: { points: 'asc' } } } },
//         },
//       });
//       lastReportLevelWithSelectedSteps = {
//         ...lastReportLevel!,
//         areas: lastReportLevel!.areas.map((area) => {
//           return {
//             ...area,
//             lastReportStepId:
//               area.steps.find((step) => step.points === 1)?.id ?? '',
//           };
//         }),
//         observation: '',
//       };
//       res.status(200).json(lastReportLevelWithSelectedSteps);
//       return;
//     }
//     const lastReport =
//       (await prisma.report
//         .findFirst({
//           where: {
//             swimmer: {
//               is: { memberNumber: Number(req.params.id) },
//             },
//           },
//           orderBy: { createdAt: 'desc' },
//           include: {
//             level: {
//               include: {
//                 areas: { include: { steps: true } },
//               },
//             },
//             ReportAndSteps: { include: { step: true } },
//             Period: true,
//           },
//         })
//         .catch((err) => {
//           console.log(err);
//         })) ?? null;

//     const isFromThisPeriod = (): boolean => {
//       if (!lastReport) {
//         return false;
//       }
//       const lastAccessDate = new Date(lastReport.createdAt);
//       if (!lastReport.Period) {
//         return false;
//       }
//       const startDate = new Date(lastReport.Period.startDate);
//       const endDate = new Date(lastReport.Period.endDate);
//       return lastAccessDate >= startDate && lastAccessDate <= endDate;
//     };
//     if (!lastReport) {
//       lastReportLevel = await prisma.level.findFirst({
//         where: {
//           levelNumber: 1,
//         },
//         include: { areas: { include: { steps: true } } },
//       });
//       lastReportLevelWithSelectedSteps = {
//         observation: '',
//         ...lastReportLevel!,
//         areas: lastReportLevel!.areas.map((area) => {
//           return {
//             ...area,
//             lastReportStepId:
//               area.steps.find((step) => step.points === 1)?.id ?? '',
//           };
//         }),
//       };
//     } else if (lastReport.approved === true && !isFromThisPeriod()) {
//       lastReportLevel = await prisma.level.findFirst({
//         where: {
//           levelNumber: lastReport.level.levelNumber + 1,
//         },
//         include: { areas: { include: { steps: true } } },
//       });
//       lastReportLevelWithSelectedSteps = {
//         observation: '',
//         ...lastReportLevel!,
//         areas: lastReportLevel!.areas.map((area) => {
//           return {
//             ...area,
//             lastReportStepId:
//               area.steps.find((step) => step.points === 1)?.id ?? '',
//           };
//         }),
//       };
//     } else {
//       lastReportLevel = lastReport.level;
//       lastReportLevelWithSelectedSteps = {
//         ...lastReportLevel,
//         observation: lastReport.observation,
//         areas: lastReportLevel.areas.map((area) => {
//           return {
//             ...area,
//             lastReportStepId:
//               (lastReport.ReportAndSteps.find(
//                 (step) => step.step.areaId === area.id,
//               )?.stepId ||
//                 area.steps.find((step) => step.points === 1)?.id) ??
//               '',
//           };
//         }),
//       };
//     }

//     res.status(200).json(lastReportLevelWithSelectedSteps);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// };
