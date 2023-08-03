import { Module } from '@nestjs/common';
import { EcryptionService } from './ecryption.service';

@Module({
  providers: [EcryptionService]
})
export class EcryptionModule {}
