import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    QuotesModule,
    JwtModule.register({
      secret: process.env.JWT_KEY, // Replace this with your secret key
      signOptions: { expiresIn: '2h' }, // Optionally, set token expiration time
    }),
  ],
  controllers: [AppController, AuthController, QuotesController],
  providers: [
    AppService,
    AuthService,
    QuotesService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
