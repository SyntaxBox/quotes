// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { Provider } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const userExists = await this.authService.validUser({
      where: { providerId: id },
      select: { id: true, EmailVerified: true },
    });
    if (userExists) return userExists;

    const newUser = await this.authService.createUser({
      data: {
        provider: Provider.GOOGLE,
        providerId: id,
        fname: name.givenName,
        lname: name.familyName,
        email: emails[0].value,
        EmailVerified: emails[0].verified,
      },
      select: { id: true },
    });
    return newUser;
  }
}
