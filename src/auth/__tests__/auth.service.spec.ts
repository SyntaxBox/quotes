import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Provider } from '@prisma/client';
import { CreateUser } from 'src/shared';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUser = {
      data: {
        fname: 'abdelhamid',
        lname: 'boudjit',
        email: 'default@example.com',
        provider: Provider.GOOGLE,
        providerId: 'defaultProviderId',
        profileImage: 'defaultProfileImage.jpg',
        emailVerified: false,
      },
      select: {
        id: true,
      },
    };

    it('should create a new user', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue({ id: 'someId', ...createUserDto.data });

      const result = await authService.create(createUserDto);

      expect(result).toEqual({ id: 'someId', ...createUserDto.data });

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { providerId: createUserDto.data.providerId },
        select: createUserDto.select,
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto.data,
        select: createUserDto.select,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue({ id: 'someId', ...createUserDto.data });

      await expect(authService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw HttpException on create error', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error());

      await expect(authService.create(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    const mockUpdateData = {
      fname: 'newFirstName',
      lname: 'newLastName',
      // Add other properties as needed
    };
    const mockSelect = {
      id: true,
      fname: true,
      lname: true,
      // Add other properties as needed
    };
    const mockWhere = {
      id: 'user_id',
    };
    const mockUpdatedUser = {
      id: 'user_id',
      fname: 'newFirstName',
      lname: 'newLastName',
      // Other properties
    };
    it('should update user successfully', async () => {
      // Mock the PrismaService update method
      prismaService.user.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const result = await authService.update({
        data: mockUpdateData,
        select: mockSelect,
        where: mockWhere,
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: mockWhere,
        data: mockUpdateData,
        select: mockSelect,
      });
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      // Mock the PrismaService update method to throw an error
      prismaService.user.update = jest
        .fn()
        .mockRejectedValue(new Error('Some error'));

      await expect(
        authService.update({
          data: mockUpdateData,
          select: mockSelect,
          where: mockWhere,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    const mockWhere = {
      id: 'user_id',
    };
    const mockDeletedUser = {
      id: 'user_id',
      fname: 'deletedFirstName',
      lname: 'deletedLastName',
      email: 'deleted@example.com',
      profileImage: 'deletedProfileImage.png',
    };

    it('should delete user successfully', async () => {
      // Mock the PrismaService delete method
      prismaService.user.delete = jest.fn().mockResolvedValue(mockDeletedUser);

      const result = await authService.delete({
        where: mockWhere,
      });

      expect(result).toEqual(mockDeletedUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: mockWhere,
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        },
      });
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      // Mock the PrismaService delete method to throw an error
      prismaService.user.delete = jest
        .fn()
        .mockRejectedValue(new Error('Some error'));

      await expect(
        authService.delete({
          where: mockWhere,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validUser', () => {
    const mockWhere = {
      id: 'user_id',
    };
    const mockSelect = {
      id: true,
      email: true,
      fname: true,
      lname: true,
      profileImage: true,
    };
    const mockUser = {
      id: 'user_id',
      fname: 'validFirstName',
      lname: 'validLastName',
      email: 'valid@example.com',
      profileImage: 'validProfileImage.png',
    };

    it('should return user if valid user exists', async () => {
      // Mock the PrismaService findUnique method
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await authService.validUser({
        where: mockWhere,
        select: mockSelect,
      });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: mockWhere,
        select: mockSelect,
      });
    });

    it('should return false if valid user does not exist', async () => {
      // Mock the PrismaService findUnique method to return null
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      const result = await authService.validUser({
        where: mockWhere,
        select: mockSelect,
      });

      expect(result).toBe(null);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: mockWhere,
        select: mockSelect,
      });
    });

    it('should throw InternalServerErrorException if findUnique fails', async () => {
      // Mock the PrismaService findUnique method to throw an error
      prismaService.user.findUnique = jest
        .fn()
        .mockRejectedValue(new Error('Some error'));

      await expect(
        authService.validUser({
          where: mockWhere,
          select: mockSelect,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('generateJWT', () => {
    it('should generate JWT token', async () => {
      const mockPayload = { userId: 'user_id' };
      const mockOptions: JwtSignOptions = { expiresIn: '1h' };
      const mockToken = 'mocked_token';

      // Mock the JwtService sign method
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.generateJWT(mockPayload, mockOptions);

      expect(result).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, mockOptions);
    });
  });
});
