// import { prismaTeachersRepository } from "../../../database/repositories/prisma-teachers-repository";
// import { TeacherEntity } from "../../../../domain/entities/TeacherEntity";
// import { Request, Response } from "express";

// export default async (req: Request, res: Response) => {
//     try {
//         const { idEmployee, email, name } = req.body;
//         const teacher = TeacherEntity.create({
//             teacherNumber: idEmployee,
//             email,
//             name,
//         });
//         const teacherInRepo = prismaTeachersRepository.create(teacher);
//         res.json(teacherInRepo);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };
