// import { prismaTeachersRepository } from '../../infra/database/repositories/prisma-teachers-repository';
// import { SYSTEM_URL, EVO_CRED } from '../../core/utils/dotenvConfig';
// import generatePhotoUrl from '../../core/utils/generatePhotoUrl';
// import toRawString from '../../core/utils/toRawString';
// import { TeacherEntity } from '../entities/TeacherEntity';
// import axios from 'axios';

// import { Response } from 'express';
// import sendEmail from './sendEmail';

// export default async (req: { body: { email: string } }, res: Response) => {
//   try {
//     const { email } = req.body;
//     let idEmployee: number | null;

//     const teacherInPrisma = await prismaTeachersRepository.findByEmail(
//       toRawString(email),
//     );

//     idEmployee = teacherInPrisma?.teacherNumber ?? null;

//     console.log(teacherInPrisma);
//     if (!teacherInPrisma) {
//       // pegar do .env
//       const credentials = btoa(EVO_CRED);
//       const fetchData = async (
//         skip = 0,
//       ): Promise<{
//         email: string;
//         name: string;
//         photoUrl: string;
//         idEmployee: number;
//       }> => {
//         const {
//           data,
//         }: {
//           data: {
//             email: string;
//             name: string;
//             photoUrl: string;
//             idEmployee: number;
//           }[];
//         } = await axios.get(
//           `https://evo-integracao.w12app.com.br/api/v1/employees`,
//           {
//             headers: {
//               Authorization: `Basic ${credentials}`,
//             },
//             params: {
//               skip,
//             },
//           },
//         );

//         let teacherData = data.find((t) => {
//           if (email == 'carlossilvacaxias10@yahoo.com.br') {
//             console.log('t.email', t.email);
//             console.log('email', email);
//           }
//           return toRawString(t.email ?? '') === toRawString(email);
//         });
//         console.log('teacherData', teacherData);
//         if (!teacherData) {
//           teacherData = data.length === 50 ? await fetchData(skip + 50) : null;
//         }
//         return teacherData;
//       };
//       const teacherData = await fetchData();
//       console.log('teacherData', teacherData);
//       if (!teacherData)
//         return res.status(401).json({ message: 'Professor não encontrado' });
//       const teacher = TeacherEntity.create({
//         email: toRawString(teacherData.email),
//         name: toRawString(teacherData.name),
//         photoUrl: teacherData.photoUrl ?? generatePhotoUrl(teacherData.name),
//         teacherNumber: teacherData.idEmployee,
//         password: '123456',
//       });
//       await prismaTeachersRepository.create(teacher);

//       idEmployee = teacherData.idEmployee;
//     }
//     console.log('idEmployee', idEmployee);
//     if (!idEmployee) res.status(400).send('Error with idEmployee');
//     const token = await prismaTeachersRepository.generateToken(idEmployee);
//     const htmlTemplate = `
//             <html>
//             <head>
//                 <style>
//                     body {
//                         font-family: Arial, sans-serif;
//                     }
//                     .container {
//                         max-width: 600px;
//                         margin: 0 auto;
//                         padding: 20px;
//                         box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//                     }
//                     .logo {
//                         text-align: center;
//                         margin-bottom: 20px;
//                     }
//                     .logo img {
//                         width: 100px;
//                         height: auto;
//                     }
//                     .content {
//                         text-align: left;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="content">
//                         <p>Olá,</p>
//                         <p>Aqui está o seu link para que você possa <b>redefinir sua senha! </b>Se você não fez essa solicitação, pode ignorar este email.</p>
//                         <p><a href="${SYSTEM_URL}/nova-senha?token=${token}">Redefinir Senha</a></p>
//                         <p>Você tem mais alguma dúvida sobre nossa plataforma? Pode entrar em contato conosco por meio desse endereço de e-mail!</p>
//                         <p>Atenciosamente,<br>Equipe do Programa Nade Bem</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;
//     await sendEmail({
//       to: email,
//       subject: 'Recuperação de senha',
//       html: htmlTemplate,
//     });

//     res.json({
//       message: 'E-mail enviado com sucesso! Confira a caixa de spam.',
//     });
//   } catch (e) {
//     res.status(400).send(e);
//   }
// };
