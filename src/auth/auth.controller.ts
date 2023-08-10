import {
  Controller,
  Get,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTAuthGuard, TrimParamsInterceptor } from 'src/shared';
import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(TrimParamsInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // google OAuth endpoint
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // do nothing :)
    // handled by passport
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

  // delete account endpoint
  // verifying if the client if it can perform this operation
  @UseGuards(JWTAuthGuard)
  @Delete('delete')
  async delete(@Req() req: any) {
    // extracting the user from the req
    // this user is assigned by AuthGuard
    const userId = req.userId as { id: string };
    // will delete the user and return user data
    return await this.authService.delete({ where: userId });
  }
}
