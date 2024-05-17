// import { prismaTeachersRepository } from "../../../database/repositories/prisma-teachers-repository";
// import { TeachersRepository } from "../../../../domain/repositories-interfaces/teachers-repository";
// import { Request, Response } from "express";

// export default async (req: Request, res: Response) => {
//     try {
//         const { token } = req.query;
//         const repository: TeachersRepository = prismaTeachersRepository;
//         const teacher = await repository.findByResetToken(token as string);
//         if (!teacher) {
//             return res.status(400).send("Teacher not found");
//         }
//         res.json(teacher);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };
