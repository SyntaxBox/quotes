import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { QuotesService } from './quotes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuotesController } from './quotes.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService],
  imports: [PrismaModule, JwtModule, AuthModule],
})
export class QuotesModule {}
