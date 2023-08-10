import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TrimParamsInterceptor } from 'src/shared';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(TrimParamsInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // google OAuth endpoint
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    //
  }

  // google OAuth callback endpoint
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleLoginCallback(@Req() req: any) {
    // extracting the user from the req
    // this user is assigned by AuthGuard
    const user = req.user as { id: string };
    // creating a JWT token with 1 month expiring date
    return await this.authService.generateJWT(user, {
      expiresIn: '30d',
    });
  }
}
