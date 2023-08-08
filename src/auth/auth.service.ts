import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateUser, UserId, ValidUser, UserProviderId } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({ data, select }: CreateUser) {
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
      console.log(err);
      throw new HttpException(
        'user could not be created',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private isIdWhere(obj: any): obj is UserId {
    return 'id' in obj;
  }

  private isProviderIdWhere(obj: any): obj is UserProviderId {
    return 'providerId' in obj;
  }

  async validUser({ where, select }: ValidUser) {
    let uniqueAttr;
    if (this.isIdWhere(where)) uniqueAttr = { id: where.id };
    else if (this.isProviderIdWhere(where))
      uniqueAttr = { providerId: where.providerId };
    else uniqueAttr = { email: where.email };

    try {
      const user = await this.prismaService.user.findUnique({
        where: uniqueAttr,
        select,
      });
      if (!user) false;
      return user;
    } catch (err) {
      throw new InternalServerErrorException('Cannot find record');
    }
  }

  async generateJWT(payload: object, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }
}
