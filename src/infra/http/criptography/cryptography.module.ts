import { Module } from '@nestjs/common';

import { Encrypter } from 'src/domain/criptography/encrypter';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    // { provide: HashComparer, useClass: BcryptHasher },
    // { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [
    Encrypter,
    // HashComparer, HashGenerator
  ],
})
export class CryptographyModule {}
