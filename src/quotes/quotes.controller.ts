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
  JWTAuthGuard,
  QueryParams,
  QuoteQuery,
  TrimParamsInterceptor,
  UpdateQuoteDTO,
} from 'src/common';
import { QuoteOwnerGuard } from 'src/common/guards/quotes.guard';

// trim extra spaces from params & queries & body string values
@UseInterceptors(TrimParamsInterceptor)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // add quote endpoint
  @Post('add-quote')
  // verifying if the client if it can perform this operation
  @UseGuards(JWTAuthGuard)
  async addQuote(
    // the required data in order to create a quote
    @Body(ValidationPipe) data: AddQuoteDTO,
    @Req() req: any,
    // returned object query params with default value
    @QuoteQuery() select: QueryParams = { quote: true },
  ) {
    // assigned by the JWT Guard
    const userId = req.userId as string;
    // creating the quote and returning the data back
    return await this.quotesService.create({
      data: { ...data, userId },
      select,
    });
  }

  // update quote endpoint
  @Patch('update/:id')
  // verifying if the client if it can perform this operation
  @UseGuards(JWTAuthGuard, QuoteOwnerGuard)
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
  @Delete('delete/:id')
  // verifying if the client if it can perform this operation
  // verifying if the client id the owner
  @UseGuards(JWTAuthGuard, QuoteOwnerGuard)
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

  @Get('random')
  //get random quote endpoint
  // adding the user info interceptor
  @UseInterceptors(AddUserInfoToResponseInterceptor)
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
  @Get('quote/:id')
  // adding the user info interceptor
  @UseInterceptors(AddUserInfoToResponseInterceptor)
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
  // adding the user info interceptor
  @UseInterceptors(AddUserInfoToResponseInterceptor)
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
    return await this.quotesService.findMany({
      take,
      skip,
      select,
    });
  }
}
