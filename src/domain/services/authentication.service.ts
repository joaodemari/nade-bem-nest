import {
  AuthPayloadDTO,
  AuthResponseDto,
  authSchema,
  responsibleAuthSchema,
} from '../../infra/http/dtos/auth/login.dto';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Encrypter } from '../criptography/encrypter';
import toRawString from '../../core/utils/toRawString';
import { AuthRepository } from '../repositories/auth-repository';
import { Role } from '../enums/role.enum';
import axios from 'axios';
import { EvoIntegrationService } from './integration/evoIntegration.service';
import { ResponsibleRepository } from '../repositories/responsibles-repository';

type AuthenticateUserUseCaseRequest = z.infer<typeof authSchema>;

type AuthenticateResponsibleUseCaseRequest = z.infer<
  typeof responsibleAuthSchema
>;

type AuthenticateUserUseCaseResponse = AuthResponseDto;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly evoIntegrationService: EvoIntegrationService,
    private readonly responsibleRepository: ResponsibleRepository,
    private encrypter: Encrypter,
  ) {}

  async authenticateResponsible({
    email,
    password,
    branchId,
  }: AuthenticateResponsibleUseCaseRequest) {
    // tentar o login no evo:
    const evoLogin = await this.evoIntegrationService.authenticateResponsible({
      email,
      password,
      branchId,
    });

    console.log(evoLogin);

    // funcionou? pegar dados do banco nade bem

    let responsible =
      await this.responsibleRepository.findByEmailWithAuth(email);

    if (!responsible) {
      // Não existe no Nade Bem? Criar Responsible no Nade Bem -> puxar todos os alunos relacionados aquele email
      const swimmers = await this.evoIntegrationService.getSwimmersByEmail({
        email,
        branchId,
      });
      await this.evoIntegrationService.upsertManySwimmers({
        swimmers,
        branchId,
      });
      // criar usuário
      responsible = await this.responsibleRepository.createResponsibleAndAuth({
        email,
        password,
        name: evoLogin.name,
        swimmerNumbers: swimmers.map((swimmer) => swimmer.idMember),
        branchId,
      });
      console.log('criou responsible', responsible);
    }
    // Já existe no Nade Bem? Puxar Responsible
    // Criar um token com os dados do Responsible

    const metadata = {
      ...evoLogin,
      name: responsible.auth.name,
      authId: responsible.auth.id,
    };

    const token = await this.encrypter.encrypt(metadata);

    const response = {
      success: true,
      metadata: {
        token: token,
        name: metadata.name,
        email: metadata.email,
        memberNumber: metadata.memberNumber ?? null,
        role: metadata.role,
        authId: metadata.authId,
        branchId: metadata.branchId,
      },
    };

    // Retornar o token
    return response;
  }

  async authenticateEnterprise({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    if (!email) throw new Error('Email not found');
    if (!password) throw new Error('Password not found');

    console.log(email);
    const userInformation = await this.authRepository.findByEmail(
      toRawString(email),
    );

    let metadata: {
      memberNumber: number;
      role: Role;
      email: string;
      branchId: string;
      name: string;
      authId: string;
    };

    if (!userInformation) {
      throw new Error('User not found');
    } else {
      const { auth, memberNumber, branchId } = userInformation;
      if (!auth) throw new Error('User not found');
      const isPasswordValid = auth.password === password;
      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      metadata = {
        memberNumber: memberNumber,
        role: auth.role as Role,
        email: auth.email,
        branchId,
        name: auth.name,
        authId: auth.id,
      };
    }

    const token = await this.encrypter.encrypt(metadata);

    const response = {
      success: true,
      metadata: {
        token: token,
        name: metadata.name,
        email: metadata.email,
        memberNumber: metadata.memberNumber ?? null,
        role: metadata.role,
        authId: metadata.authId,
        branchId: metadata.branchId,
      },
    };

    return response;
  }

  // async handle({ email, password }: LoginDTO): Promise<LoginResponseDto> {
  //   let user;
  //   let teacherInPrisma: TeacherEntity;
  //   try {
  //     teacherInPrisma = await this.teacherRepository.checkEmailAndPass(
  //       toRawString(email),
  //       password,
  //     );
  //     if (teacherInPrisma) {
  //       console.log(teacherInPrisma);
  //       user = {
  //         firstName: teacherInPrisma.name,
  //         userId: teacherInPrisma.teacherNumber,
  //         email: teacherInPrisma.email,
  //         profile: 'teacher',
  //       };
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   if (!teacherInPrisma && !user) {
  //     try {
  //       // Dummy authentication logic (replace with your authentication logic)
  //       const credentials = btoa(process.env.EVO_CRED!);

  //       const { data } = await axios.post(
  //         `https://evo-integracao.w12app.com.br/api/v1/members/auth?email=${encodeURIComponent(
  //           email,
  //         )}&password=${encodeURIComponent(password)}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Basic ${credentials}`,
  //           },
  //         },
  //       );

  //       if (!data) {
  //         return {
  //           success: false,
  //         };
  //       }
  //       console.log(data);
  //       user = {
  //         firstName: data.name,
  //         userId: data.idMember,
  //         email: email,
  //         profile: 'swimmer',
  //       };
  //     } catch (e) {
  //       return { success: false };
  //     }
  //   }

  //   const secretKey = process.env.JWT_PRIVATE_KEY!;

  //   const token = jwt.sign(user, secretKey, {
  //     expiresIn: '7d',
  //   });

  //   return {
  //     token,
  //     ...user,
  //   };
  // }
}
