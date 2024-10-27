import {
  AuthResponseDto,
  authSchema,
} from '../../infra/http/dtos/auth/login.dto';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Encrypter } from '../criptography/encrypter';
import toRawString from '../../core/utils/toRawString';
import { AuthRepository } from '../repositories/auth-repository';

type AuthenticateUserUseCaseRequest = z.infer<typeof authSchema>;

type AuthenticateUserUseCaseResponse = AuthResponseDto;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authRepository: AuthRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    if (!email) throw new Error('Email not found');
    if (!password) throw new Error('Password not found');

    console.log(email);
    const { auth, memberNumber, branchId } =
      await this.authRepository.findByEmail(toRawString(email));
    if (!auth) throw new Error('User not found');
    const isPasswordValid = auth.password === password;
    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    const metadata = {
      memberNumber: memberNumber,
      role: auth.role,
      email: auth.email,
      branchId,
      name: auth.name,
      authId: auth.id,
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

    console.log(response);

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
