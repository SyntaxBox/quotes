import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException('No token found in headers.');
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      const validUser = await this.authService.validUser({
        where: { id: decodedToken },
        select: { id: true },
      });

      if (validUser) {
        request.userId = decodedToken.id;
        return true;
      } else throw new UnauthorizedException('Invalid token.');
    } catch (error) {
      throw new UnauthorizedException('Invalid token.');
    }
  }

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
