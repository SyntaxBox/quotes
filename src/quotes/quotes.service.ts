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
} from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private readonly prismaService: PrismaService) {}
  async findRandom({ select }: RandomQuote) {
    return await this.prismaService.quote.findFirst({
      orderBy: { id: 'asc' },
      take: 1,
      select,
    });
  }
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

  async findUnique({ where, select }: FindUniqueQuote) {
    try {
      const quote = await this.prismaService.quote.findUnique({
        where,
        select,
      });
      return quote;
    } catch (err) {
      throw new NotFoundException('quote not found');
    }
  }

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
      return quotes;
    } catch (err) {
      throw new NotFoundException('quote not found');
    }
  }

  async update({ data, select, where }: UpdateQuote) {
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
