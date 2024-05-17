// import { prismaSwimmersRepository } from '../../infra/database/repositories/prisma-swimmers-repository';
// import { EVO_CRED } from '../../core/utils/dotenvConfig';
// import { SwimmerEvo } from '../../domain/Evo/interfaces/SwimmerEvoInterface';
// import axios from 'axios';

// export default async (
//   memberNumber: number,
// ): Promise<{
//   swimmer: {
//     name: string;
//     actualLevel: string;
//     photoUrl: string;
//   };
//   reports: {
//     period: string;
//     teacherName: string;
//     level: string;
//     id: string;
//   }[];
// }> => {
//   try {
//     const url = `https://evo-integracao.w12app.com.br/api/v1/members/${memberNumber}`;
//     const credentials = btoa(EVO_CRED);
//     const { data }: { data: SwimmerEvo } = await axios.get(url, {
//       headers: {
//         Authorization: `Basic ${credentials}`, // Use btoa here
//       },
//     });

//     const swimmer = await prismaSwimmersRepository.upsertOneFromEvo(data);
//     return {
//       swimmer: {
//         name: swimmer.name,
//         actualLevel: swimmer.actualLevel,
//         photoUrl: swimmer.photoUrl,
//       },
//       reports: [],
//     };
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// };
