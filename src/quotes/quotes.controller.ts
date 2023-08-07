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
  BadRequestException,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import {
  AddQuoteDTO,
  AddUserInfoToResponseInterceptor,
  JwtAuthGuard,
  QueryParams,
  QuoteQuery,
  TrimParamsInterceptor,
  UpdateQuoteDTO,
} from 'src/common';
import { QuoteOwnerGuard } from 'src/common/guards/quotes.guard';

@UseInterceptors(TrimParamsInterceptor)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('add-quote')
  @UseGuards(JwtAuthGuard)
  async addQuote(
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() req: any,
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    const userId = req.userId as string;
    return await this.quotesService.create({
      data: { ...data, userId },
      select,
    });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  async updateQuote(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateQuoteDTO,
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    return this.quotesService.update({
      where: { id },
      data,
      select: { quote: true, ...select },
    });
  }

  @UseGuards(JwtAuthGuard, QuoteOwnerGuard)
  @Delete('delete/:id')
  async deleteQuote(
    @Param('id') id: string,
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    return await this.quotesService.delete({
      where: { id },
      select: { quote: true, ...select },
    });
  }

  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('random')
  async getRandomQuote(@QuoteQuery() select: QueryParams = { quote: true }) {
    return await this.quotesService.findRandom({
      select: {
        id: true,
        ...select,
      },
    });
  }

  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('quote/:id')
  async getQuote(
    @Param('id') id: string,
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    return await this.quotesService.findUnique({
      where: { id },
      select,
    });
  }

  @Get()
  async getQuotes(
    @QuoteQuery() select: QueryParams = { quote: true },
    @Query('take') takeString = '10',
    @Query('skip') skipString = '0',
  ) {
    const take = parseInt(takeString);
    const skip = parseInt(skipString);
    if (Number.isNaN(take))
      throw new BadRequestException(
        `numeric string is expected => ${takeString}`,
      );
    if (Number.isNaN(skip))
      throw new BadRequestException(
        `numeric string is expected => ${skipString}`,
      );
    return await this.quotesService.findMany({
      take,
      skip,
      select,
    });
  }
}
