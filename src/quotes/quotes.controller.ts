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
  UseInterceptors,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import {
  AddQuoteDTO,
  AddUserInfoToResponseInterceptor,
  JwtAuthGuard,
  ParseBooleanPipe,
  QueryParams,
  QuoteQuery,
  UpdateQuoteDTO,
} from 'src/common';
import { QuoteOwnerGuard } from 'src/common/guards/quotes.guard';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('add-quote')
  @UseGuards(JwtAuthGuard)
  async addQuote(
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() req,
    @QuoteQuery() select: QueryParams,
  ) {
    const { userId } = req;
    return await this.quotesService.create({
      data: { ...data, userId },
      select: { ...select, id: true },
    });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  async updateQuote(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateQuoteDTO,
    @QuoteQuery() select: QueryParams,
  ) {
    return this.quotesService.update({
      where: { id },
      data,
      select: { id: true, ...select },
    });
  }

  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  @Delete('delete/:id')
  async deleteQuote(
    @Param('id') id: string,
    @QuoteQuery() select: QueryParams,
  ) {
    return await this.quotesService.delete({
      where: { id },
      select: { id: true, ...select },
    });
  }

  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('random')
  async getRandomQuote(@QuoteQuery() select: QueryParams) {
    return await this.quotesService.findRandom({
      select: {
        id: true,
        ...select,
      },
    });
  }

  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('quote/:id')
  async getQuote(@Param('id') id: string, @QuoteQuery() select: QueryParams) {
    return await this.quotesService.findUnique({
      where: { id },
      select: { ...select, id: true },
    });
  }

  @Get('quotes')
  async getQuotes() {
    return 'shit';
  }
}
