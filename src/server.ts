// import {
//   Area,
//   Level,
//   PrismaClient,
//   Step,
//   Report,
//   Prisma,
// } from "@prisma/client";
// import express, { Request, Response } from "express";
// import cors from "cors";
// import axios from "axios";
// import jwt from "jsonwebtoken";
// import RefreshSwimmersByTeacherController from "./infra/http/controllers/Teacher/RefreshSwimmersByTeacher.controller";
// import { authenticateToken } from "./infra/auth/AuthenticatedRequest";
// import getNextReportTemplateController from "./infra/http/controllers/Swimmer/getNextReportTemplate.controller";
// import { EVO_CRED } from "./core/utils/dotenvConfig";
// import listSwimmersController from "./infra/http/controllers/Swimmer/listSwimmers.controller";
// import sendResetPasswordEmail from "./domain/use-cases/sendResetPasswordEmail";
// import sendResponsiblePasswordEmail from "./domain/use-cases/sendResponsiblePasswordEmail";
// import toRawString from "./core/utils/toRawString";
// import getTeacherByTokenController from "./infra/http/controllers/Teacher/getTeacherByToken.controller";
// import updateTeacherPasswordController from "./infra/http/controllers/Teacher/updateTeacherPassword.controller";
// import createTeacherController from "./infra/http/controllers/Teacher/createTeacher.controller";
// import getSwimmerPageInfoController from "./infra/http/controllers/Swimmer/getSwimmerPageInfo.controller";
// import createSwimmerController from "./infra/http/controllers/Swimmer/createSwimmer.controller";
// import generateReportPdfBySwimmerController from "./infra/http/controllers/Teacher/generateReportPdf.controller";

// const app = express();
// const prisma = new PrismaClient();
// const port = process.env.PORT;

// app.use(cors());
// app.use(express.json());

// app.get("/swimmers", authenticateToken, listSwimmersController);

// app.get("/reports/pdf/:reportId", generateReportPdfBySwimmerController);

// app.post("/teacher/reset-password", sendResetPasswordEmail);

// app.get("/responsible/reset-password", sendResponsiblePasswordEmail);

// app.get("/teacher/reset-password", getTeacherByTokenController);

// app.put("/teacher/reset-password", updateTeacherPasswordController);

// app.post("/teacher", createTeacherController);

// app.get("/swimmers/:idMember", getSwimmerPageInfoController);

// app.post("/swimmers", createSwimmerController);

// app.post(
//   "/reports/:id",
//   async (
//     req: {
//       body: {
//         levelId: string;
//         steps: string[];
//         observation: string;
//         memberNumber: number;
//       };
//       params: { id: string };
//     },
//     res
//   ) => {
//     try {
//       const { levelId, steps, observation, memberNumber } = req.body;
//       const level = await prisma.level.findFirst({
//         where: { id: levelId },
//         include: { areas: { include: { steps: true } } },
//       });

//       const period = await prisma.period.findFirst({
//         where: {
//           startDate: { lte: new Date() },
//           endDate: { gte: new Date() },
//         },
//       });

//       const approved = steps.every((stepId) => {
//         const step = level?.areas
//           .find((area) => area.steps.some((s) => s.id === stepId))
//           ?.steps.find((s) => s.id === stepId);
//         return step?.points === 3;
//       });
//       if (!level) res.status(400).send("Level not found");

//       let data = {
//         approved,
//         ReportAndSteps: {
//           create: steps.map((id) => {
//             return {
//               step: {
//                 connect: {
//                   id,
//                 },
//               },
//             };
//           }),
//         },
//         level: { connect: { id: levelId } },
//         observation,
//         swimmer: { connect: { memberNumber } },
//         Period: { connect: { id: period.id } },
//       };
//       let report;
//       if (req.params.id !== "new") {
//         report = await prisma.report.update({
//           data,
//           where: { id: req.params.id, periodId: period.id },
//         });
//         if (!report) res.status(400).send("Report not found");
//       } else {
//         report = await prisma.report.create({ data });
//       }
//       await prisma.swimmer.update({
//         where: { memberNumber: memberNumber },
//         data: {
//           actualLevel: {
//             connect: {
//               id: levelId,
//             },
//           },
//           lastReport: new Date(),
//           lastReportId: report.id,
//         },
//       });
//       res.json(report);
//     } catch (e) {
//       console.log(e);
//       res.status(400).send(e);
//     }
//   }
// );

// app.get(
//   "/reports/:id",
//   async (
//     req: {
//       params: { id: string };
//       query: { take: string; skip: string };
//     },

//     res
//   ) => {
//     let { take, skip } = req.query;

//     if ((take && Number.isNaN(take)) || (skip && Number.isNaN(skip)))
//       res.status(400).send("Invalid query params");
//     try {
//       const reports = await prisma.report.findMany({
//         where: {
//           swimmer: {
//             is: { memberNumber: Number(req.params.id) },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         take: +take ?? 10,
//         skip: +skip ?? 0,
//         include: {
//           level: {
//             include: {
//               areas: { include: { steps: true } },
//             },
//           },
//           ReportAndSteps: { include: { step: true } },
//         },
//       });

//       const reportsResult = reports!.map((report) => {
//         let reportLevel:
//           | ({ areas: ({ steps: Step[] } & Area)[] } & Level)
//           | null;
//         let reportLevelWithSelectedSteps:
//           | ({
//               areas: ({
//                 lastReportStepId: string;
//                 steps: Step[];
//               } & Area)[];
//             } & Level)
//           | null;
//         reportLevel = report.level;
//         reportLevelWithSelectedSteps = {
//           ...reportLevel,
//           areas: reportLevel.areas.map((area) => {
//             return {
//               ...area,
//               lastReportStepId:
//                 report.ReportAndSteps.find(
//                   (step) => step.step.areaId === area.id
//                 )?.stepId ?? "",
//             };
//           }),
//         };
//         return reportLevelWithSelectedSteps;
//       });

//       res.status(200).json(reportsResult);
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   }
// );

// app.get(
//   "/reports/last/:id",
//   async (
//     req: {
//       params: { id: string };
//     },
//     res
//   ) => {
//     try {
//       const report = await prisma.report
//         .findFirst({
//           where: {
//             swimmer: {
//               is: { memberNumber: Number(req.params.id) },
//             },
//           },
//           orderBy: { createdAt: "desc" },
//           include: {
//             level: {
//               include: {
//                 areas: { include: { steps: true } },
//               },
//             },
//             ReportAndSteps: { include: { step: true } },
//           },
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//       if (!report) throw new Error("Report not found");
//       let reportLevel: ({ areas: ({ steps: Step[] } & Area)[] } & Level) | null;
//       let reportLevelWithSelectedSteps:
//         | ({
//             report: Report;
//             areas: ({
//               lastReportStepId: string;
//               steps: Step[];
//             } & Area)[];
//           } & Level)
//         | null;
//       reportLevel = report.level;
//       reportLevelWithSelectedSteps = {
//         ...reportLevel,
//         report: report,
//         areas: reportLevel.areas.map((area) => {
//           return {
//             ...area,
//             lastReportStepId:
//               report.ReportAndSteps.find((step) => step.step.areaId === area.id)
//                 ?.stepId ?? "",
//           };
//         }),
//       };
//       res.status(200).json(reportLevelWithSelectedSteps);
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   }
// );



// app.get(
//   "/reports/actual-template/:id",
//   authenticateToken,
//   getNextReportTemplateController
// );

// app.post(
//   "/levels",
//   async (
//     req: {
//       body: {
//         name: string;
//         levelNumber: number;
//         areas: [
//           {
//             title: string;
//             steps: [
//               {
//                 description: string;
//                 points: number;
//               }
//             ];
//           }
//         ];
//       };
//     },
//     res
//   ) => {
//     const { levelNumber, name, areas } = req.body;
//     let level = await prisma.level
//       .create({
//         data: {
//           name,
//           levelNumber,
//           areas: {
//             create: areas.map((area) => {
//               const { title, steps } = area;
//               return {
//                 title,
//                 steps: {
//                   create: steps.map((step) => {
//                     const { description, points } = step;
//                     return { description, points };
//                   }),
//                 },
//               };
//             }),
//           },
//         },
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     res.status(200).json(level);
//   }
// );

// app.get("/levels", async (req, res) => {
//   let level = await prisma.level
//     .findMany({
//       include: { areas: { include: { steps: true } } },
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   res.status(200).json(level);
// });

// // Secret key for JWT signing and verification
// const secretKey = process.env.JWT_PRIVATE_KEY!;
// // Authentication route
// app.post("/login", async (req: Request, res: Response) => {
//   let user;
//   const { email, senha } = req.body;
//   let teacherInPrisma;
//   try {
//     teacherInPrisma = await prisma.teacher.findFirst({
//       where: { password: senha, email: toRawString(email) },
//     });
//     if (teacherInPrisma) {
//       user = {
//         firstName: teacherInPrisma.name,
//         userId: teacherInPrisma.teacherNumber,
//         email: teacherInPrisma.email,
//         profile: "teacher",
//       };
//     }
//   } catch (e) {
//     console.log(e);
//   }
//   if (!teacherInPrisma && !user) {
//     try {
//       // Dummy authentication logic (replace with your authentication logic)
//       const credentials = btoa(EVO_CRED);

//       const { data } = await axios.post(
//         `https://evo-integracao.w12app.com.br/api/v1/members/auth?email=${encodeURIComponent(
//           email
//         )}&password=${encodeURIComponent(senha)}`,
//         {},
//         {
//           headers: {
//             Authorization: `Basic ${credentials}`,
//           },
//         }
//       );

//       if (!data) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }
//       console.log(data);
//       user = {
//         firstName: data.name,
//         userId: data.idMember,
//         email: email,
//         profile: "swimmer",
//       };
//     } catch (e) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//   }

//   // Generate a JWT token
//   const token = jwt.sign(user, secretKey, {
//     expiresIn: "7d",
//   });

//   res.json({
//     token,
//     ...user,
//   });
// });

// app.post(
//   "/teacher/refresh",
//   authenticateToken,
//   RefreshSwimmersByTeacherController
// );

// app.get("/", async (req, res) => {
//   res.send("i am batman...");
// });

// app.listen(port, () => {
//   console.log(`Listening on ${port}`);
// });
