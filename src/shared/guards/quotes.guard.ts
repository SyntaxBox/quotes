import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { QuotesService } from 'src/quotes/quotes.service';

// checking if the the client is the quote owner
@Injectable()
export class QuoteOwnerGuard implements CanActivate {
  constructor(private readonly quoteService: QuotesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // userId is assigned by the JWT Guard
    const userId = request.userId;
    // extracting the quote id form the the request params
    const quoteId = request.params.id;

    // basic condition to make sure that the constants are valid
    if (!userId) throw new UnauthorizedException('No user id found');
    if (!quoteId) throw new BadRequestException('No quote id found');

    try {
      // fetching the quote from the db
      // extracting the userId from the quote
      // userId refers to the owner of the quote
      const quoteUser = await this.quoteService.findUnique({
        where: { id: quoteId },
        select: { userId: true },
      });

      // checking if the client userId and the extracted userId are the same
      // if they are the same means the client is the owner and can pass to the next handler
      // else it will return authorization exception
      if (quoteUser.userId === userId) {
        request.owner = true;
        return true;
      } else throw new UnauthorizedException('You are not the owner');
    } catch (error) {
      throw new UnauthorizedException('Invalid quote id.');
    }
  }
}
