import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUser, validUser } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({ data, select }: CreateUser) {
    const usedEmail = await this.prismaService.user.findFirst({
      where: { email: data.email },
      select: { email: true },
    });
    if (usedEmail) throw new ConflictException('Email already signed up');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(data.password, 10);
    } catch (err) {
      throw new HttpException(
        'cannot check password validity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const newUser = await this.prismaService.user.create({
        data: { ...data, password: hashedPassword },
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

  async validUser({ where, select }: validUser) {
    const { email, password } = where;
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { ...select, password: true },
    });
    if (!user) throw new NotFoundException('Email Not Found');
    console.log(user, password);
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        !select.password && delete user.password;
        return user;
      } else {
        throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'cannot check password validity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateToken(payload: object, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }
}
