import { JwtSignOptions } from '@nestjs/jwt';
import { Provider, User } from '@prisma/client';
import {
  CreateUser,
  ObjectUtils,
  UpdateUser,
  ValidUser,
  deleteUser,
} from 'src/shared';

const objectUtils = new ObjectUtils();
const defaultValues: User = {
  id: 'defaultId',
  fname: 'abdelhamid',
  lname: 'boudjit',
  email: 'default@example.com',
  provider: Provider.GOOGLE,
  providerId: 'defaultProviderId',
  profileImage: 'defaultProfileImage.jpg',
  emailVerified: false,
};

export const AuthServiceMock = {
  create: jest.fn(({ data, select }: CreateUser): Promise<Partial<User>> => {
    const newUser: User = {
      ...data,
      ...defaultValues,
    };
    return new Promise((resolve) => {
      resolve(objectUtils.selectKeys(newUser, select));
    });
  }),

  update: jest.fn(
    ({ data, select, where }: UpdateUser): Promise<Partial<User>> => {
      const updatedUser: User = {
        ...data,
        ...where,
        ...defaultValues,
      };
      return new Promise((resolve) => {
        resolve(objectUtils.selectKeys(updatedUser, select));
      });
    },
  ),

  delete: jest.fn(({ where }: deleteUser): Promise<Partial<User>> => {
    const deletedUser = {
      ...where,
      ...defaultValues,
    };
    return new Promise((resolve) => {
      resolve(
        objectUtils.selectKeys(deletedUser, {
          id: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        }),
      );
    });
  }),

  generateJWT: jest.fn((payload: object, options?: JwtSignOptions) => {
    return new Promise((resolve) => {
      resolve('jwtToken');
    });
  }),

  validUser: jest.fn(({ where, select }: ValidUser) => {
    const validUser = {
      ...where,
      ...defaultValues,
    };
    return new Promise((resolve) => {
      resolve(objectUtils.selectKeys(validUser, select));
    });
  }),
};
