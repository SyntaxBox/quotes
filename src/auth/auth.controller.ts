import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignInDto } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signIn(@Body(ValidationPipe) data: SignInDto) {
    const user = this.authService.createUser({ data, select: { id: true } });

    return user;
  }

  @Post('login')
  async login(@Body(ValidationPipe) data: LoginDto) {
    const user = await this.authService.validUser({
      where: data,
      select: { id: true },
    });

    return this.authService.generateJWT(user, { expiresIn: '24h' });
  }
}
