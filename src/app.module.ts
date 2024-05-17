import { Module } from '@nestjs/common';
import { SwimmersController } from './infra/http/controllers/swimmer/swimmers.controller';
import { DatabaseModule } from './infra/database/database.module';
import { SwimmersService } from './domain/services/swimmers.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './infra/http/http.module';
import { envSchema } from './infra/env/env';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    BullModule.forRoot({
      redis: {
        host: 'redis-19227.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
        port: 19227,
        password: 'bzB4pGUcvXYg6iIzqTBALEmtlq6eG2fY',
      },
    }),
  ],
  controllers: [SwimmersController],
  providers: [SwimmersService],
})
export class AppModule {}
