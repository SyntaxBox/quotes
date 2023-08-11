import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  CreateUser,
  UserId,
  ValidUser,
  UserProviderId,
  UserCredentials,
  UpdateUser,
  deleteUser,
} from 'src/shared';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // create new user object
  async create({ data, select }: CreateUser) {
    const userExists = await this.prismaService.user.findFirst({
      where: { providerId: data.providerId },
      select,
    });
    if (userExists) throw new ConflictException('user already exists');
    try {
      const newUser = await this.prismaService.user.create({
        data,
        select,
      });
      return newUser;
    } catch (err) {
      throw new HttpException(
        'user could not be created',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // update user object
  async update({ data, select, where }: UpdateUser) {
    const uniqueAttr = this.uniqueSelectionAttribute(where);
    try {
      const updatedUser = await this.prismaService.user.update({
        where: uniqueAttr,
        data,
        select,
      });
      return updatedUser;
    } catch (err) {
      throw new InternalServerErrorException('cannot update record');
    }
  }

  // delete user object
  async delete({ where }: deleteUser) {
    try {
      const updatedUser = await this.prismaService.user.delete({
        where,
        // return deleted user data
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          profileImage: true,
        },
      });
      return updatedUser;
    } catch (err) {
      throw new InternalServerErrorException('cannot update record');
    }
  }

  // check if the user exists in the db
  async validUser({ where, select }: ValidUser) {
    try {
      const user = await this.prismaService.user.findUnique({
        where,
        select,
      });
      if (!user) false;
      return user;
    } catch (err) {
      throw new InternalServerErrorException('Cannot find record');
    }
  }

  // generate jwt token
  async generateJWT(payload: object, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  //!unused method
  // check the given unique attribute to fetch unique user record
  private uniqueSelectionAttribute(
    where: UserId | UserProviderId | UserCredentials,
  ): UserId & UserProviderId & UserCredentials {
    const returnValue = {
      id: undefined,
      providerId: undefined,
      email: undefined,
    };
    if ('id' in where) {
      returnValue.id = where.id;
    } else if ('providerId' in where) {
      returnValue.providerId = where.providerId;
    } else if ('email' in where) {
      returnValue.email = where.email;
    }
    return returnValue;
  }
}
