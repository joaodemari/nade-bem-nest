// import { prismaSwimmersRepository } from "../../../database/repositories/prisma-swimmers-repository";
// import createSwimmerFromEvoService from "../../../../domain/use-cases/createSwimmerFromEvo.service";
// import { Request, Response } from "express";

// export default async (req: Request, res: Response) => {
//     try {
//         if (Number.isNaN(req.params.idMember))
//             return res.status(400).send("Invalid member number");
//         const memberNumber = Number(req.params.idMember);
//         let result: {
//             swimmer: {
//                 name: string;
//                 actualLevel: string;
//                 photoUrl: string;
//             };
//             reports: {
//                 period: string;
//                 teacherName: string;
//                 level: string;
//                 id: string;
//             }[];
//         } = await prismaSwimmersRepository.findSwimmerAndReports(memberNumber);

//         if (!result) {
//             result = await createSwimmerFromEvoService(memberNumber);
//         }
//         if (!result) {
//             return res.status(400).send("Swimmer not found");
//         }
//         res.json(result);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };
