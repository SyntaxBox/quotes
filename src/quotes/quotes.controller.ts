import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AddQuoteDTO, JwtAuthGuard } from 'src/common';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}
  @Post('add-quote')
  @UseGuards(JwtAuthGuard)
  async addQuote(
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() { userId }: { userId: string },
  ) {
    return this.quotesService.createQuote({
      data: { ...data, userId },
      select: { quote: true },
    });
  }
}
