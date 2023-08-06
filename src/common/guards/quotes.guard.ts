import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';

@Injectable()
export class QuoteOwnerGuard implements CanActivate {
  constructor(private readonly quoteService: QuotesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;

    const quoteId = request.params.id;
    if (!userId) throw new UnauthorizedException('No user id found');
    if (!quoteId) throw new BadRequestException('No quote id found');

    try {
      const quoteUser = await this.quoteService.findUnique({
        where: { id: quoteId },
        select: { userId: true },
      });

      if (quoteUser.userId === userId) {
        request.owner = true;
        return true;
      } else throw new UnauthorizedException('You are not the owner');
    } catch (error) {
      throw new UnauthorizedException('Invalid quote id.');
    }
  }
}
