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
  ParseBooleanPipe,
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
    @Query() select: any,
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
    @Query('id', ParseBooleanPipe) ids: boolean,
  ) {
    return this.quotesService.update({
      where: { id },
      data,
      select: { id: ids },
    });
  }

  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  @Delete('delete/:id')
  async deleteQuote(@Param('id') id: string, @Query() select: any) {
    return await this.quotesService.delete({ where: { id }, select });
  }

  @Get('random')
  async getRandomQuote(
    @Query('author', ParseBooleanPipe) author: boolean,
    @Query('quote', ParseBooleanPipe) quote: boolean,
    @Query('published', ParseBooleanPipe) published: boolean,
    @Query('showUserInformation', ParseBooleanPipe)
    showUserInformation: boolean,
    @Query('createdAt', ParseBooleanPipe) createdAt: boolean,
    @Query('updatedAt', ParseBooleanPipe) updatedAt: boolean,
  ) {
    return await this.quotesService.findRandom({
      select: {
        id: true,
        author,
        quote,
        createdAt,
        published,
        showUserInformation,
        updatedAt,
      },
    });
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
