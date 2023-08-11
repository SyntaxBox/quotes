import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateQuote,
  FindUniqueQuote,
  UpdateQuote,
  DeleteQuote,
  RandomQuote,
  FindManyQuotes,
} from 'src/shared';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private readonly prismaService: PrismaService) {}
  // creating new quote
  async create({ data, select }: CreateQuote) {
    try {
      const newQuote = await this.prismaService.quote.create({
        data,
        select,
      });
      return newQuote;
    } catch (err) {
      throw new HttpException(
        'quote could not be created',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // fetching random quote
  async findRandom({ select }: RandomQuote) {
    // returns an array with single quote
    const quote = await this.prismaService.quote.findMany({
      skip: Math.floor(
        Math.random() * (await this.prismaService.quote.count()),
      ),
      take: 1,
      // make sure that alway will return the id
      select: { id: true, ...select },
    });
    // returning the quote
    return quote[0];
  }

  // finding unique quote using id
  async findUnique({ where, select }: FindUniqueQuote) {
    try {
      const quote = await this.prismaService.quote.findUnique({
        where,
        // make sure that id is always selected
        select: { id: true, ...select },
      });
      if (!quote) throw new NotFoundException('quote not found');
      return quote;
    } catch (err) {
      throw new NotFoundException('quote not found');
    }
  }

  // finding many quotes
  // take means the number of records
  // skip means the number of skipped records
  // records are orders in descendant order
  async findMany({ take, skip, where, select }: FindManyQuotes) {
    try {
      const quotes = await this.prismaService.quote.findMany({
        where,
        take,
        skip,
        select,
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (quotes.length === 0)
        throw new NotFoundException('no quotes found with current parameters');
      return quotes;
    } catch (err) {
      throw new NotFoundException('quote not found');
    }
  }

  // updating single quote via id
  async update({ where, data, select }: UpdateQuote) {
    try {
      const updatedQuote = await this.prismaService.quote.update({
        where,
        data,
        select,
      });
      return updatedQuote;
    } catch (err) {
      throw new HttpException(
        'quote could not be updated',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // deleting single quote via id
  async delete({ select, where }: DeleteQuote) {
    try {
      const updatedQuote = await this.prismaService.quote.delete({
        where,
        select,
      });
      return updatedQuote;
    } catch (err) {
      throw new HttpException(
        'quote could not be updated',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
