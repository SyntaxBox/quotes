import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';
import { RedirectMiddleware } from './shared';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    QuotesModule,
    JwtModule.register({
      secret: process.env.JWT_KEY, // Replace this with your secret key
      signOptions: { expiresIn: '24h' }, // Optionally, set token expiration time
    }),
  ],
  controllers: [AuthController, QuotesController],
  providers: [
    AuthService,
    QuotesService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedirectMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to all routes and methods
  }
}
