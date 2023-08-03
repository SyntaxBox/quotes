import { Controller, Post, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from 'src/common';

@UseGuards(JwtAuthGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}
  @Post('add-quote')
  async addQuote() {
    return 'fuck';
    // return this.quotesService.createQuote({
    //   data: { ...data, userId },
    //   select: { quote: true },
    // });
  }
}
