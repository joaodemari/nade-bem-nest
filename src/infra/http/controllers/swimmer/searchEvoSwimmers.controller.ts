// import { Response } from "express";
// import { AuthenticatedRequest } from "../../../auth/AuthenticatedRequest";
// import { prismaSwimmersRepository } from "../../../database/repositories/prisma-swimmers-repository";
// import cleanContains from "../../../../core/utils/cleanContains";
// import { SwimmerPresenter } from "../../../presenters/swimmers-presenter";
// import { prismaPeriodsRepository } from "../../../database/repositories/prisma-periods-repository";
// import { PeriodPresenter } from "../../../presenters/periods-presenter";
// import { evourl } from "../../../api/evourl";
// import { SwimmerEvo } from "../domain/Evo/interfaces/SwimmerEvoInterface";

// export default async (
//     req: AuthenticatedRequest & {
//         query: { take: number; skip: number; search: string };
//     },
//     res: Response
// ) => {
//     try {
//         let { take, search } = {
//             take: 4,
//             search: req.query.search ?? "",
//         };

//         let swimmers: SwimmerEvo[] = await evourl.get("/members");

//         res.json({ swimmers });
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };
