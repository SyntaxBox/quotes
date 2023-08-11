import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from '../google.strategy';
import { AuthService } from '../auth.service';
import { ObjectUtils } from 'src/shared'; // Update this import as per your project structure
import { Provider } from '@prisma/client';
import { Profile } from 'passport-google-oauth20';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthServiceMock } from '../__mocks__/auth.service.mock';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let authService: AuthService;
  let objectUtils: ObjectUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
        {
          provide: ObjectUtils,
          useValue: {
            getObjectDifferences: jest.fn(),
          },
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
    objectUtils = module.get<ObjectUtils>(ObjectUtils);
  });

  describe('validate', () => {
    const mockProfile: Profile = {
      id: 'google_profile_id',
      name: {
        givenName: 'John',
        familyName: 'Doe',
      },
      emails: [{ value: 'john.doe@example.com', verified: true }],
      photos: [{ value: 'profile_image_url' }],
    };
    const mockValidUserResult = {
      id: 'user_id',
      emailVerified: true,
      email: 'john.doe@example.com',
      fname: 'John',
      lname: 'Doe',
      profileImage: 'profile_image_url',
    };

    it('should return user id if user exists', async () => {
      AuthServiceMock.validUser.mockResolvedValue(mockValidUserResult);
      jest.spyOn(objectUtils, 'getObjectDifferences').mockReturnValue({});

      const result = await googleStrategy.validate(
        {},
        'accessToken',
        'refreshToken',
        mockProfile,
      );

      expect(result).toEqual({ id: 'user_id' });
      expect(authService.validUser).toHaveBeenCalledWith({
        where: { providerId: 'google_profile_id' },
        select: {
          id: true,
          emailVerified: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        },
      });
    });

    it('should return user id after updating if data is different', async () => {
      const mockProfile: Profile = {
        id: 'google_profile_id',
        name: {
          givenName: 'John',
          familyName: 'Doe',
        },
        emails: [{ value: 'john.doe@example.com', verified: true }],
        photos: [{ value: 'profile_image_url' }],
      };
      const mockValidUserResult = {
        id: 'user_id',
        emailVerified: true,
        email: 'john.doe@example.com',
        fname: 'John',
        lname: 'Doe',
        profileImage: 'profile_image_url',
      };
      const mockDifferences = {
        fname: 'UpdatedFirstName',
      };
      const mockUpdatedUser = {
        id: 'user_id',
      };

      AuthServiceMock.validUser.mockResolvedValue(mockValidUserResult);
      jest
        .spyOn(objectUtils, 'getObjectDifferences')
        .mockReturnValue(mockDifferences);
      AuthServiceMock.update.mockResolvedValue(mockUpdatedUser);

      const result = await googleStrategy.validate(
        {},
        'accessToken',
        'refreshToken',
        mockProfile,
      );

      expect(result).toEqual({ id: 'user_id' });
      expect(authService.validUser).toHaveBeenCalledWith({
        where: { providerId: 'google_profile_id' },
        select: {
          id: true,
          emailVerified: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        },
      });
      expect(objectUtils.getObjectDifferences).toHaveBeenCalledWith(
        {
          profileImage: 'profile_image_url',
          fname: 'John',
          lname: 'Doe',
          email: 'john.doe@example.com',
          emailVerified: true,
        },
        {
          fname: 'John',
          lname: 'Doe',
          email: 'john.doe@example.com',
          emailVerified: true,
          profileImage: 'profile_image_url',
        },
      );
      expect(authService.update).toHaveBeenCalledWith({
        where: { providerId: 'google_profile_id' },
        data: mockDifferences,
        select: { id: true },
      });
    });

    it('should return user id after creating new user', async () => {
      const mockValidUserResult = null; // No existing user

      AuthServiceMock.validUser.mockResolvedValue(mockValidUserResult);
      AuthServiceMock.create.mockResolvedValue({ id: 'new_user_id' });

      const result = await googleStrategy.validate(
        {},
        'accessToken',
        'refreshToken',
        mockProfile,
      );

      expect(result).toEqual({ id: 'new_user_id' });
      expect(authService.validUser).toHaveBeenCalledWith({
        where: { providerId: 'google_profile_id' },
        select: {
          id: true,
          emailVerified: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        },
      });
      expect(authService.create).toHaveBeenCalledWith({
        data: {
          provider: Provider.GOOGLE,
          providerId: 'google_profile_id',
          profileImage: 'profile_image_url',
          fname: 'John',
          lname: 'Doe',
          email: 'john.doe@example.com',
          emailVerified: true,
        },
        select: { id: true },
      });
    });

    it('should throw InternalServerErrorException if validation or update fails', async () => {
      AuthServiceMock.validUser.mockRejectedValue(
        new InternalServerErrorException('Cannot find record'),
      );

      await expect(
        googleStrategy.validate(
          {},
          'accessToken',
          'refreshToken',
          mockProfile as Profile,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
