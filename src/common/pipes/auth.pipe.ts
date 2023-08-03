import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class IdValidationPipe implements PipeTransform<string, string> {
  private readonly context: ExecutionContext;

  constructor(
    context: ExecutionContext,
    private readonly authService: AuthService,
  ) {
    this.context = context;
  }
  transform(value: string): string {
    const request = this.context.switchToHttp().getRequest();

    const { userId } = request;
    const validUser = this.authService.validUser({
      where: { id: userId },
      select: { id: true },
    });
    if (!validUser) throw new BadRequestException('Invalid token data');
    return value;
  }
}
