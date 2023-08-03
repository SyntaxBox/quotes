import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException('No token found in headers.');
    }

    try {
      const decodedToken = this.jwtService.verify(token);
      request.userId = decodedToken.id; // Assign the decoded token id to the request object for future use.
      return true;
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
