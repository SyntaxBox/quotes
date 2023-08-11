import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthServiceMock } from '../__mocks__/auth.service.mock';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService, // Provide the mock directly
          useValue: AuthServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('googleLoginCallback', () => {
    it('should generate JWT token after Google login callback', async () => {
      const mockUser = { id: 'user_id' };
      const mockToken = 'mocked_token';

      AuthServiceMock.generateJWT.mockResolvedValue(mockToken);

      const req = { user: mockUser };

      const result = await authController.googleLoginCallback(req);

      expect(result).toBe(mockToken);
      expect(AuthServiceMock.generateJWT).toHaveBeenCalledWith(mockUser, {
        expiresIn: '30d',
      });
    });
  });

  describe('delete', () => {
    it('should delete user account', async () => {
      const mockUserId = { id: 'user_id' };
      const mockDeleteResult = {
        id: 'user_id',
        fname: 'abdelhamid',
        lname: 'boudjit',
        email: 'default@example.com',
        profileImage: 'img.png',
      };

      AuthServiceMock.delete.mockResolvedValue(mockDeleteResult);

      const req = { userId: mockUserId };

      const result = await authController.delete(req);

      expect(result).toBe(mockDeleteResult);
      expect(AuthServiceMock.delete).toHaveBeenCalledWith({
        where: mockUserId,
      });
    });
  });
});
