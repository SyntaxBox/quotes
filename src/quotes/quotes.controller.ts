import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AddQuoteDTO, IdValidationPipe, JwtAuthGuard } from 'src/common';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}
  @Post('add-quote')
  @UseGuards(JwtAuthGuard)
  @UsePipes(IdValidationPipe)
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
