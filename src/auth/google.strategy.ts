import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { Provider } from '@prisma/client';
import { ObjectUtils, UserData } from 'src/shared';

// google OAuth strategy
// returns user object
// user object has id property
// id is the user db id
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly objectUtils: ObjectUtils,
  ) {
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
  ): Promise<{ id: string }> {
    const profileData = {
      // extract the data from the profile object
      provider: Provider.GOOGLE,
      providerId: profile.id,
      ...this.extractProfileInfo(profile),
    };
    //fetch if there is user signed using this profile
    const userExists = await this.authService.validUser({
      where: { providerId: profileData.providerId },
      select: {
        id: true,
        EmailVerified: true,
        email: true,
        fname: true,
        lname: true,
        profileImage: true,
      },
    });

    //checking the user if exists
    if (userExists) {
      // see if there is any data changed from the last login
      // user data from the db
      const dbUserData = { ...userExists };
      // deleting the id -- not needed
      delete dbUserData.id;
      const differences = this.objectUtils.getObjectDifferences(
        this.extractProfileInfo(profile),
        dbUserData,
      ) as Partial<UserData>;
      // checking if there is some differences
      if (!Object.keys(differences).length) return { id: userExists.id };

      // update the differences
      const updatedUser = await this.authService.update({
        where: { providerId: profileData.providerId },
        data: { ...differences },
        select: { id: true },
      });

      return { id: updatedUser.id }; // return the id
    }

    // if there is no exiting user ==> will create new user
    const newUser = await this.authService.create({
      data: profileData,
      select: { id: true },
    });

    return { id: newUser.id }; //return the id
  }

  // extracting some profile info data
  private extractProfileInfo(profile: Profile) {
    return {
      profileImage: profile.photos[0]?.value,
      fname: profile.name.givenName,
      lname: profile.name.familyName,
      email: profile.emails[0]?.value,
      EmailVerified: profile.emails[0]?.verified,
    };
  }
}
