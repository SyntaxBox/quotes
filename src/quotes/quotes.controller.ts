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
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { AddQuoteDTO, JwtAuthGuard } from 'src/common';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-quote')
  async addQuote(@Body(ValidationPipe) data: AddQuoteDTO, @Req() req) {
    const { userId } = req;
    return await this.quotesService.createQuote({
      data: { ...data, userId },
      select: {
        quote: true,
        author: true,
        createdAt: true,
        published: true,
        showUserInformation: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateQuote(@Param('id') id: string) {
    return id;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteQuote() {
    return 'shit';
  }

  @Get('random')
  async getRandomQuote() {
    return 'shit';
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
