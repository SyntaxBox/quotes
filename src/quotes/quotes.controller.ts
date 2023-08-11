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
  UnauthorizedException,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import {
  AddUserInfoToResponseInterceptor,
  JWTAuthGuard,
  QueryParams,
  QuoteQuery,
  TrimParamsInterceptor,
  QuoteOwnerGuard,
  AddQuoteDTO,
  UpdateQuoteDTO,
} from 'src/shared';

// trim extra spaces from params & queries & body string values
@UseInterceptors(TrimParamsInterceptor)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // add quote endpoint
  // verifying if the client if it can perform this operation
  @UseGuards(JWTAuthGuard)
  @Post('add-quote')
  async addQuote(
    // the required data in order to create a quote
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() req: any,
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    let userId: string;
    try {
      // assigned by the JWT Guard
      userId = req.userId as string;
    } catch (err) {
      throw new UnauthorizedException('cannot assure if you are the owner');
    }
    // creating the quote and returning the data back
    return await this.quotesService.create({
      data: { ...data, userId },
      select,
    });
  }

  // update quote endpoint
  // verifying if the client if it can perform this operation
  @UseGuards(JWTAuthGuard, QuoteOwnerGuard)
  @Patch('update/:id')
  async updateQuote(
    // the quote unique id
    @Param('id') id: string,
    // the required data in order to create a quote
    @Body(ValidationPipe) data: UpdateQuoteDTO,
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    // updating the quote and returning the data back
    return await this.quotesService.update({
      where: { id },
      data,
      select,
    });
  }
  //delete quote endpoint
  // verifying if the client if it can perform this operation
  // verifying if the client id the owner
  @UseGuards(JWTAuthGuard, QuoteOwnerGuard)
  @Delete('delete/:id')
  async deleteQuote(
    // the quote unique id
    @Param('id') id: string,
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    // deleting the quote and returning the data back
    return await this.quotesService.delete({
      where: { id },
      select,
    });
  }

  //get random quote endpoint
  // adding the user info interceptor
  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('random')
  async getRandomQuote(
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    // fetching the random quote and returning the data back
    return await this.quotesService.findRandom({
      select,
    });
  }

  //get single quote endpoint
  // adding the user info interceptor
  @UseInterceptors(AddUserInfoToResponseInterceptor)
  @Get('quote/:id')
  async getQuote(
    // quote unique id
    @Param('id') id: string,
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    // fetching the quote and returning the data back
    return await this.quotesService.findUnique({
      where: { id },
      select,
    });
  }

  //get a list of quotes endpoint
  @Get()
  async getQuotes(
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
    // number of quotes with 10 as default value
    @Query('take') takeString = '10',
    // number of the quote to skip with 0 as default value
    @Query('skip') skipString = '0',
  ) {
    // parsing the string to number
    const take = parseInt(takeString);
    const skip = parseInt(skipString);
    // if the parse result is NaN will throw an exception
    if (Number.isNaN(take))
      throw new BadRequestException(
        `numeric string is expected => ${takeString}`,
      );
    if (Number.isNaN(skip))
      throw new BadRequestException(
        `numeric string is expected => ${skipString}`,
      );
    // fetching the quotes and returning the data back
    const quotes = await this.quotesService.findMany({
      take,
      skip,
      select,
    });
    return { quotes };
  }
}
