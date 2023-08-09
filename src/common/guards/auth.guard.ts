import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

// checking if the jwt token and it's data are valid
// token payload is a user id
// checking if the id is valid
@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // extracting jwt token
    const token = this.extractTokenFromHeaders(request);

    // checking if token is available
    if (!token) {
      throw new UnauthorizedException('No token found in headers.');
    }

    try {
      // decoding the token & checking if the user is valid
      const decodedToken = this.jwtService.verify(token);
      const validUser = await this.authService.validUser({
        where: { id: decodedToken.id },
        select: { id: true },
      });
      // checking if the user is valid
      if (validUser) {
        // adding the user id to the request to be used later
        request.userId = decodedToken.id;
        return true;
      } else throw new UnauthorizedException('Invalid token.');
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
  // extracting the jwt from the request headers
  private extractTokenFromHeaders(request: any): string {
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer ')
    ) {
      return request.headers.authorization.split(' ')[1];
    }
    return null;
  }
}
