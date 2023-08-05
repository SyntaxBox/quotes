import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuote, UpdateQuote } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private readonly prismaService: PrismaService) {}
  async createQuote({ data, select }: CreateQuote) {
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

  async updateQuote({ data, select, where }: UpdateQuote) {
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
}
