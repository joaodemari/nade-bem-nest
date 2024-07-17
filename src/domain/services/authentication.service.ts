import {
  AuthResponseDto,
  authSchema,
} from '../../infra/http/dtos/auth/login.dto';
import { TeachersRepository } from '../repositories/teachers-repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../core/types/either';
import { z } from 'zod';
import { NoCompleteInformation } from '../../core/errors/no-complete-information-error';
import { ActionNotAllowed } from '../../core/errors/action-not-allowed-error';
import { ResourceNotFound } from '../../core/errors/resource-not-found';
import { Encrypter } from '../criptography/encrypter';
import toRawString from '../../core/utils/toRawString';
import { AuthRepository } from '../repositories/auth-repository';

type AuthenticateUserUseCaseRequest = z.infer<typeof authSchema>;

type AuthenticateUserUseCaseResponse = Either<
  ActionNotAllowed,
  AuthResponseDto
>;

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
    if (!email) return left(new NoCompleteInformation('user email'));
    if (!password) return left(new NoCompleteInformation('user password'));

    console.log(email);
    const { auth, memberNumber } = await this.authRepository.findByEmail(
      toRawString(email),
    );
    if (!auth) return left(new ResourceNotFound(email));
    const isPasswordValid = auth.password === password;
    if (!isPasswordValid) {
      return left(new ActionNotAllowed(auth.name, 'Wrong password'));
    }

    const metadata = {
      memberNumber: memberNumber,
      role: auth.role,
      email: auth.email,
      branchId: auth.branchId,
      name: auth.name,
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
      },
    };

    console.log(response);

    return right(response);
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
