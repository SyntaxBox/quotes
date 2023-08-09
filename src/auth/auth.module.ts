import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { ObjectUtils } from 'src/common';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, ObjectUtils],
  imports: [
    PrismaModule,
    JwtModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
