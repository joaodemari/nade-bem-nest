// import { PrismaClient } from "@prisma/client";
// import { randomUUID } from "crypto";
// import { SwimmerEntity } from "../../../domain/entities/SwimmerEntity";
// import { ResponsibleEntity } from "../../../domain/entities/ResponsibleEntity";
// import { PrismaResponsiblesMapper } from "../mappers/prisma-responsible-mapper.ts";

// export class PrismaResponsiblesRepository {
//     private prisma: PrismaClient;
//     constructor() {
//         this.prisma = new PrismaClient();
//     }
//     async findByResetToken(token: string): Promise<ResponsibleEntity | null> {
//         const responsible = await this.prisma.responsible.findUnique({
//             where: {
//                 resetToken: token,
//             },
//         });

//         if (!responsible) {
//             return null;
//         }

//         return PrismaResponsiblesMapper.toDomain(responsible);
//     }

//     async findByEmail(
//         responsibleEmail: string
//     ): Promise<ResponsibleEntity | null> {
//         const responsible = await this.prisma.responsible.findUnique({
//             where: {
//                 email: responsibleEmail,
//             },
//         });

//         if (!responsible) {
//             return null;
//         }

//         return PrismaResponsiblesMapper.toDomain(responsible);
//     }

//     async updatePassword(token: string, newPassword: string): Promise<void> {
//         await this.prisma.responsible.update({
//             where: {
//                 resetToken: token,
//             },
//             data: {
//                 password: newPassword,
//             },
//         });
//     }

//     async generateToken(responsibleEmail: string): Promise<string> {
//         const token = randomUUID();
//         await this.prisma.responsible.update({
//             where: {
//                 email: responsibleEmail,
//             },
//             data: {
//                 resetToken: token,
//             },
//         });
//         return token;
//     }

//     async create(responsible: ResponsibleEntity): Promise<void> {
//         await this.prisma.responsible.create({
//             data: PrismaResponsiblesMapper.toPersistence(responsible),
//         });
//     }
// }

// export const prismaResponsiblesRepository = new PrismaResponsiblesRepository();
