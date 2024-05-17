// import { prismaSwimmersRepository } from '../../../database/repositories/prisma-swimmers-repository';
// import { SwimmerEntity } from '../../../../domain/entities/SwimmerEntity';
// import { Request, Response } from 'express';

// export default async (
//   req: {
//     body: {
//       memberNumber: number;
//       photoUrl: string;
//       lastAccess: string;
//       name: string;
//       actualLevel: string;
//     };
//   } & Request,
//   res: Response,
// ) => {
//   const { memberNumber, name, photoUrl, lastAccess, actualLevel } = req.body;
//   const swimmer = SwimmerEntity.create({
//     memberNumber,
//     name,
//     photoUrl,
//     lastAccess,
//     actualLevel,
//   });
//   const user = prismaSwimmersRepository.create(swimmer);
//   res.json(user);
// };
