// import { prismaTeachersRepository } from '../../../database/repositories/prisma-teachers-repository';
// import { TeachersRepository } from '../../../../domain/repositories-interfaces/teachers-repository';
// import { Request, Response } from 'express';

// export default async (req: Request, res: Response) => {
//   try {
//     const { token, password } = req.body;
//     const repository: TeachersRepository = prismaTeachersRepository;
//     const teacher = await repository.findByResetToken(token);
//     if (!teacher) {
//       res.status(400).send('Teacher not found');
//       return;
//     }
//     await repository.updatePassword(token, password);
//     res.json({ success: true });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// };
