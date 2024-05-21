import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../../env/env.service';
import { AuthPayloadDTO } from '../../../infra/http/dtos/auth/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const privateKey = config.get('JWT_PRIVATE_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(privateKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: AuthPayloadDTO): Promise<AuthPayloadDTO> {
    console.log(payload);

    return {
      memberNumber: payload.memberNumber,
      role: payload.role,
      email: payload.email,
    };
  }
}
