import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
