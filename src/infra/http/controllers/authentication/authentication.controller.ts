import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ActionNotAllowed } from 'src/core/errors/action-not-allowed-error';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthenticationService } from 'src/domain/services/authentication.service';
import { AuthDTO, AuthResponseDto } from 'src/infra/http/dtos/auth/login.dto';
import { IsPublic } from '../../decorators/is-public.decorator';

@IsPublic()
@Controller('login')
export class AuthenticationController {
  constructor(private readonly AuthenticationService: AuthenticationService) {}

  @Post()
  async login(@Body() login: AuthDTO): Promise<AuthResponseDto> {
    const result = await this.AuthenticationService.execute(login);
    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ActionNotAllowed:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
