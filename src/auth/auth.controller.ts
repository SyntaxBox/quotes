import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TrimParamsInterceptor } from 'src/common';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(TrimParamsInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    //
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: any) {
    // console.log(req);
  }

  @Get('h')
  async g() {
    return await this.authService.validUser({
      where: { id: 'hello' },
      select: { id: true },
    });
  }
}
