import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpStrategy } from 'src/infra/auth/strategies/http.strategy';
import { JwtStrategy } from 'src/infra/auth/strategies/jwt.strategy';
import { DatabaseModule } from 'src/infra/database/database.module';
import { EnvModule } from 'src/infra/env/env.module';
import { EnvService } from 'src/infra/env/env.service';
import { AuthenticationController } from '../controllers/authentication/authentication.controller';
import { AuthenticationService } from 'src/domain/services/authentication.service';
import { CryptographyModule } from '../criptography/cryptography.module';
import { JwtAuthGuard } from 'src/infra/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    CryptographyModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY');

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
        };
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    EnvService,
    HttpStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthenticationModule {}
