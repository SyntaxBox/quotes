import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import {
  AddQuoteDTO,
  JwtAuthGuard,
  QueryParamsDTO,
  UpdateQuoteDTO,
} from 'src/common';
import { QuoteOwnerGuard } from 'src/common/guards/quotes.guard';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-quote')
  async addQuote(
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() req,
    @Query(ValidationPipe) select: QueryParamsDTO,
  ) {
    const { userId } = req;
    return await this.quotesService.create({
      data: { ...data, userId },
      select,
    });
  }

  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  @Patch('update/:id')
  async updateQuote(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateQuoteDTO,
    @Query(ValidationPipe) select: QueryParamsDTO,
  ) {
    return this.quotesService.update({
      where: { id },
      data,
      select,
    });
  }

  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  @Delete('delete/:id')
  async deleteQuote(
    @Param('id') id: string,
    @Query(ValidationPipe) select: QueryParamsDTO,
  ) {
    return await this.quotesService.delete({ where: { id }, select });
  }

  @Get('random')
  async getRandomQuote(@Query(ValidationPipe) select: QueryParamsDTO) {
    console.log(select);
    return await this.quotesService.findRandom({ select });
  }

  @Get('quote/:id')
  async getQuote() {
    return 'shit';
  }

  @Get('quotes')
  async getQuotes() {
    return 'shit';
  }
}
