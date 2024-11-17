import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthenticationService } from '../../../../domain/services/authentication.service';
import {
  AuthDTO,
  AuthResponseDto,
  ResponsibleAuthDTO,
} from '../../../../infra/http/dtos/auth/login.dto';
import { IsPublic } from '../../decorators/is-public.decorator';

@IsPublic()
@Controller('login')
export class AuthenticationController {
  constructor(private readonly AuthenticationService: AuthenticationService) {}

  @Post()
  async login(@Body() login: AuthDTO): Promise<AuthResponseDto> {
    try {
      const result =
        await this.AuthenticationService.authenticateEnterprise(login);

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('responsible')
  async loginResponsible(
    @Body() login: ResponsibleAuthDTO,
  ): Promise<AuthResponseDto> {
    try {
      const result =
        await this.AuthenticationService.authenticateResponsible(login);

      return result;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
