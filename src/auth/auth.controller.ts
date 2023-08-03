import {
  Body,
  Controller,
  Get,
  Module,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LoginDto, SignInDto } from 'src/common';

@Controller('auth')
@Module({
  providers: [AuthService],
})
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
    return this.authService.generateToken(user, { expiresIn: '24h' });
  }

  @Get('token')
  @UseGuards(JwtAuthGuard)
  async token(@Req() { id }) {
    return this.authService.generateToken({ id }, { expiresIn: '365d' });
  }
}
